import {
  checkQuestAnswers,
  getQuest,
  listQuests
} from "../apps/api/src/quest-content-service.js";
import { findQuest } from "../apps/api/src/quests.js";
import { normalizeWalletAddress } from "../apps/api/src/validation.js";
import { verifyWalletProofWorker } from "../apps/api/src/wallet-proof-worker.js";

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer"
};

export default {
  async fetch(request, env) {
    const startedAt = Date.now();
    const url = new URL(request.url);

    try {
      const response = await routeRequest(request, env, url);

      console.log(JSON.stringify({
        event: "request",
        method: request.method,
        path: url.pathname,
        status: response.status,
        durationMs: Date.now() - startedAt
      }));

      return withCors(response, request, url);
    } catch (error) {
      console.error(JSON.stringify({
        event: "request_error",
        method: request.method,
        path: url.pathname,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error)
      }));

      return json({
        error: "Unexpected server error."
      }, 500);
    }
  }
};

async function routeRequest(request, env, url) {
  if (request.method === "OPTIONS") {
    if (!isAllowedOrigin(request, url)) {
      return json({ error: "Origin not allowed." }, 403);
    }
    return new Response(null, { status: 204, headers: JSON_HEADERS });
  }

  if (request.method === "POST" && !isAllowedOrigin(request, url)) {
    return json({ error: "Origin not allowed." }, 403);
  }

  if (request.method === "GET" && url.pathname === "/health") {
    return json({
      ok: true,
      service: "nimquest-worker"
    });
  }

  if (request.method === "GET" && url.pathname === "/api/quests") {
    return json({ quests: listQuests() });
  }

  if (request.method === "GET" && url.pathname === "/api/leaderboard") {
    return listLeaderboard(env.DB);
  }

  if (request.method === "GET" && url.pathname === "/api/completions") {
    return listWalletCompletions(env.DB, url.searchParams.get("wallet"));
  }

  const completionMatch = url.pathname.match(/^\/api\/completions\/([^/]+)$/);
  if (request.method === "GET" && completionMatch) {
    return getCompletion(env.DB, decodeURIComponent(completionMatch[1]));
  }

  const questMatch = url.pathname.match(/^\/api\/quests\/([^/]+)$/);
  if (request.method === "GET" && questMatch) {
    const quest = getQuest(decodeURIComponent(questMatch[1]));
    return quest
      ? json({ quest })
      : json({ error: "Quest not found." }, 404);
  }

  if (request.method === "POST" && url.pathname === "/api/grade") {
    const limited = await enforceRateLimit(env.DB, request, "grade", 30, 60);
    if (limited) return limited;
    const result = checkQuestAnswers(await readJson(request));
    return result.ok
      ? json(result)
      : json({ error: result.error }, result.status);
  }

  if (request.method === "POST" && url.pathname === "/api/completion-challenges") {
    const limited = await enforceRateLimit(env.DB, request, "challenge", 10, 300);
    if (limited) return limited;
    return createCompletionChallenge(env.DB, await readJson(request));
  }

  if (request.method === "POST" && url.pathname === "/api/complete") {
    const limited = await enforceRateLimit(env.DB, request, "complete", 20, 300);
    if (limited) return limited;
    return completeQuest(env.DB, await readJson(request));
  }

  if (request.method === "POST" && url.pathname === "/api/feedback") {
    const limited = await enforceRateLimit(env.DB, request, "feedback", 10, 300);
    if (limited) return limited;
    return submitFeedback(env.DB, await readJson(request));
  }

  return json({ error: "Route not found." }, 404);
}

async function listLeaderboard(database) {
  const result = await database.prepare(
    `SELECT wallet_address,
            COUNT(*) AS verified_quests,
            MIN(completed_at) AS first_verified_at,
            MAX(completed_at) AS latest_verified_at
     FROM completions
     WHERE status = 'verified'
     GROUP BY wallet_address
     ORDER BY verified_quests DESC, first_verified_at ASC, wallet_address ASC
     LIMIT 100`
  ).all();

  return json({
    leaderboard: result.results.map((record, index) => ({
      rank: index + 1,
      walletLabel: maskWalletAddress(record.wallet_address),
      verifiedQuests: Number(record.verified_quests),
      firstVerifiedAt: record.first_verified_at,
      latestVerifiedAt: record.latest_verified_at
    }))
  });
}

async function listWalletCompletions(database, walletValue) {
  const walletAddress = normalizeWalletAddress(walletValue);
  if (!walletAddress) {
    return json({ error: "A valid Nimiq wallet address is required." }, 400);
  }

  const result = await database.prepare(
    `SELECT public_id, quest_id, wallet_address, verification_method,
            completed_at, status, reward_status
     FROM completions
     WHERE wallet_address = ?
     ORDER BY completed_at DESC`
  ).bind(walletAddress).all();

  return json({
    completions: result.results.map(toPublicProof)
  });
}

async function getCompletion(database, publicId) {
  const record = await database.prepare(
    `SELECT public_id, quest_id, wallet_address, verification_method,
            completed_at, status, reward_status
     FROM completions
     WHERE public_id = ? OR proof_key = ?`
  ).bind(publicId, publicId).first();

  return record
    ? json({ proof: toPublicProof(record) })
    : json({ error: "Verified completion not found." }, 404);
}

async function submitFeedback(database, body) {
  if (typeof body.proofKey !== "string" || !body.proofKey) {
    return json({ error: "A verified proof is required." }, 400);
  }
  if (typeof body.feedbackToken !== "string" || body.feedbackToken.length < 32) {
    return json({ error: "Feedback authorization is required." }, 401);
  }
  if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 3) {
    return json({ error: "Feedback rating must be between 1 and 3." }, 400);
  }

  const proof = await database.prepare(
    "SELECT proof_key, feedback_token_hash FROM completions WHERE public_id = ?"
  ).bind(body.proofKey).first();
  if (!proof) {
    return json({ error: "Verified completion not found." }, 404);
  }
  const submittedTokenHash = await sha256Hex(body.feedbackToken);
  if (!constantTimeEqual(submittedTokenHash, proof.feedback_token_hash || "")) {
    return json({ error: "Feedback authorization is invalid." }, 403);
  }

  await database.prepare(
    `INSERT INTO completion_feedback (proof_key, rating, note, submitted_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT (proof_key) DO UPDATE SET
       rating = excluded.rating,
       note = excluded.note,
       submitted_at = excluded.submitted_at`
  ).bind(
    proof.proof_key,
    body.rating,
    typeof body.note === "string" ? body.note.trim().slice(0, 280) : "",
    new Date().toISOString()
  ).run();

  return json({ ok: true, message: "Feedback saved." }, 201);
}

async function createCompletionChallenge(database, body) {
  if (!findQuest(body.questId)) {
    return json({ error: "Quest not found." }, 404);
  }

  const walletAddress = normalizeWalletAddress(body.walletAddress);
  if (!walletAddress) {
    return json({ error: "A valid Nimiq wallet address is required." }, 400);
  }

  const id = crypto.randomUUID();
  const nonce = randomHex(32);
  const now = Date.now();
  const issuedAt = new Date(now).toISOString();
  const expiresAt = new Date(now + CHALLENGE_TTL_MS).toISOString();
  const message = [
    "NimQuest completion proof",
    `Quest: ${body.questId}`,
    `Wallet: ${walletAddress}`,
    `Nonce: ${nonce}`,
    `Issued: ${issuedAt}`,
    `Expires: ${expiresAt}`
  ].join("\n");

  const activeChallenges = await database.prepare(
    `SELECT COUNT(*) AS active_count
     FROM completion_challenges
     WHERE wallet_address = ? AND used_at IS NULL AND expires_at > ?`
  ).bind(walletAddress, issuedAt).first();
  if (Number(activeChallenges?.active_count || 0) >= 5) {
    return json({ error: "Too many active challenges. Wait five minutes and try again." }, 429);
  }

  await database.batch([
    database
      .prepare("DELETE FROM completion_challenges WHERE expires_at <= ?")
      .bind(issuedAt),
    database.prepare(
      `INSERT INTO completion_challenges
        (id, quest_id, wallet_address, device_id, message, issued_at, expires_at, used_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`
    ).bind(
      id,
      body.questId,
      walletAddress,
      "not-collected",
      message,
      issuedAt,
      expiresAt
    )
  ]);

  return json({
    ok: true,
    challenge: { id, message, expiresAt }
  }, 201);
}

async function completeQuest(database, body) {
  const grading = checkQuestAnswers({
    questId: body.questId,
    answers: body.answers
  });

  if (!grading.ok) {
    return json({ error: grading.error }, grading.status);
  }

  if (!grading.passed) {
    return json({
      ...grading,
      verified: false,
      message: "Review the lesson and try again."
    });
  }

  if (typeof body.challengeId !== "string" || !body.challengeId) {
    return json({ error: "Challenge not found." }, 400);
  }

  const challenge = await database.prepare(
    `SELECT id, quest_id, wallet_address, device_id, message, issued_at, expires_at, used_at
     FROM completion_challenges
     WHERE id = ?`
  ).bind(body.challengeId).first();

  if (!challenge) {
    return json({ error: "Challenge not found." }, 400);
  }

  if (challenge.used_at) {
    return json({ error: "Challenge has already been used." }, 400);
  }

  const now = new Date().toISOString();
  if (challenge.expires_at <= now) {
    return json({ error: "Challenge has expired." }, 400);
  }

  if (challenge.quest_id !== body.questId) {
    return json({ error: "Challenge does not belong to this quest." }, 400);
  }

  const walletProof = await verifyWalletProofWorker({
    challenge: {
      questId: challenge.quest_id,
      walletAddress: challenge.wallet_address,
      message: challenge.message
    },
    walletAddress: body.walletAddress,
    publicKey: body.publicKey,
    signature: body.signature
  });

  if (!walletProof.ok) {
    return json({ error: walletProof.error }, 401);
  }

  const proofKey = `${body.questId}:${walletProof.walletAddress}`;
  const publicId = crypto.randomUUID();
  const feedbackToken = randomHex(32);
  const feedbackTokenHash = await sha256Hex(feedbackToken);
  const completedAt = now;
  const existing = await database.prepare(
    "SELECT proof_key FROM completions WHERE quest_id = ? AND wallet_address = ?"
  ).bind(body.questId, walletProof.walletAddress).first();
  const results = await database.batch([
    database.prepare(
      `INSERT INTO completions
        (proof_key, quest_id, wallet_address, device_id, public_key,
         verification_method, completed_at, status, reward_status, public_id, feedback_token_hash)
       SELECT ?, ?, ?, ?, ?, 'nimiq_message_signature', ?, 'verified', 'unavailable', ?, ?
       FROM completion_challenges
       WHERE id = ? AND used_at IS NULL AND expires_at > ?
       ON CONFLICT (quest_id, wallet_address) DO UPDATE SET
         feedback_token_hash = excluded.feedback_token_hash`
    ).bind(
      proofKey,
      body.questId,
      walletProof.walletAddress,
      "not-collected",
      walletProof.publicKey,
      completedAt,
      publicId,
      feedbackTokenHash,
      body.challengeId,
      completedAt
    ),
    database.prepare(
      `UPDATE completion_challenges
       SET used_at = ?
       WHERE id = ? AND used_at IS NULL AND expires_at > ?`
    ).bind(completedAt, body.challengeId, completedAt)
  ]);

  if (results[1].meta.changes !== 1) {
    return json({ error: "Challenge has already been used or expired." }, 409);
  }

  const stored = await database.prepare(
    `SELECT proof_key, public_id, quest_id, wallet_address, public_key,
            verification_method, completed_at, status, reward_status
     FROM completions
     WHERE quest_id = ? AND wallet_address = ?`
  ).bind(body.questId, walletProof.walletAddress).first();

  if (!stored) {
    throw new Error("Verified completion was not persisted.");
  }

  return json({
    ok: true,
    passed: true,
    verified: true,
    newlyCompleted: !existing,
    score: grading.score,
    total: grading.total,
    proof: toProof(stored),
    feedbackToken,
    message: results[0].meta.changes === 1
      ? "Quest completion verified."
      : "Quest was already verified for this wallet."
  });
}

function toProof(record) {
  return {
    key: record.public_id,
    questId: record.quest_id,
    walletAddress: record.wallet_address,
    publicKey: record.public_key,
    verificationMethod: record.verification_method,
    completedAt: record.completed_at,
    status: record.status,
    reward: {
      status: record.reward_status,
      asset: null,
      amount: null
    }
  };
}

function toPublicProof(record) {
  const quest = findQuest(record.quest_id);
  return {
    key: record.public_id,
    questId: record.quest_id,
    questTitle: quest?.title || record.quest_id,
    track: quest?.track || null,
    difficulty: quest?.difficulty || null,
    walletAddress: maskWalletAddress(record.wallet_address),
    verificationMethod: record.verification_method,
    completedAt: record.completed_at,
    status: record.status,
    reward: {
      status: record.reward_status,
      asset: null,
      amount: null
    }
  };
}

function maskWalletAddress(value) {
  const compact = String(value || "").replace(/\s+/g, "");
  return `${compact.slice(0, 8)}${"*".repeat(10)}`;
}

async function enforceRateLimit(database, request, route, limit, windowSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSeconds);
  const source = request.headers.get("cf-connecting-ip") || "local";
  const keyHash = await sha256Hex(`${route}:${source}:${windowStart}`);

  await database.prepare(
    "DELETE FROM request_limits WHERE window_start < ?"
  ).bind(now - 3600).run();
  await database.prepare(
    `INSERT INTO request_limits (key_hash, route, window_start, request_count)
     VALUES (?, ?, ?, 1)
     ON CONFLICT (key_hash) DO UPDATE SET request_count = request_count + 1`
  ).bind(keyHash, route, windowStart).run();
  const record = await database.prepare(
    "SELECT request_count FROM request_limits WHERE key_hash = ?"
  ).bind(keyHash).first();

  return Number(record?.request_count || 0) > limit
    ? json({ error: "Too many requests. Try again later." }, 429)
    : null;
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
}

function isAllowedOrigin(request, url) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  if (origin === url.origin) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function withCors(response, request, url) {
  const origin = request.headers.get("origin");
  if (!origin || !isAllowedOrigin(request, url)) return response;
  const headers = new Headers(response.headers);
  headers.set("access-control-allow-origin", origin);
  headers.set("access-control-allow-methods", "GET,POST,OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
  headers.set("vary", "Origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function randomHex(byteLength) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function readJson(request) {
  const contentLength = Number.parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > 32_768) {
    throw new Error("Request body is too large.");
  }

  const body = await request.json();
  return body && typeof body === "object" ? body : {};
}

function json(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: JSON_HEADERS
  });
}

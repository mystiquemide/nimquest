import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkQuestAnswers,
  createCompletionChallenge,
  getCompletionStore,
  getQuest,
  gradeQuest,
  listQuests
} from "./quest-service.js";
import { normalizeWalletAddress } from "./validation.js";

const PORT = Number.parseInt(process.env.PORT || "8787", 10);
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const DIST_ROOT = path.join(PROJECT_ROOT, "dist");
const CONTENT_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

export function createServer() {
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const origin = request.headers.origin;
      const allowedOrigin =
        !origin ||
        origin === url.origin ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

      if (!allowedOrigin && (request.method === "POST" || request.method === "OPTIONS")) {
        return sendJson(response, 403, { error: "Origin not allowed." });
      }
      if (origin && allowedOrigin) {
        response.setHeader("access-control-allow-origin", origin);
        response.setHeader("access-control-allow-methods", "GET,POST,OPTIONS");
        response.setHeader("access-control-allow-headers", "content-type");
        response.setHeader("vary", "Origin");
      }

      if (request.method === "OPTIONS") {
        return sendJson(response, 204, null);
      }

      if (request.method === "GET" && url.pathname === "/health") {
        return sendJson(response, 200, {
          ok: true,
          service: "nimquest-api"
        });
      }

      if (request.method === "GET" && url.pathname === "/api/quests") {
        return sendJson(response, 200, {
          quests: listQuests()
        });
      }

      if (request.method === "GET" && url.pathname === "/api/leaderboard") {
        const leaderboard = getCompletionStore()
          .values()
          .filter((proof) => proof.status === "verified")
          .reduce((wallets, proof) => {
            const existing = wallets.get(proof.walletAddress);
            if (!existing) {
              wallets.set(proof.walletAddress, {
                walletAddress: proof.walletAddress,
                verifiedQuests: 1,
                firstVerifiedAt: proof.completedAt,
                latestVerifiedAt: proof.completedAt
              });
              return wallets;
            }

            existing.verifiedQuests += 1;
            if (proof.completedAt < existing.firstVerifiedAt) {
              existing.firstVerifiedAt = proof.completedAt;
            }
            if (proof.completedAt > existing.latestVerifiedAt) {
              existing.latestVerifiedAt = proof.completedAt;
            }
            return wallets;
          }, new Map());
        const ranked = Array.from(leaderboard.values())
          .sort((a, b) =>
            b.verifiedQuests - a.verifiedQuests ||
            a.firstVerifiedAt.localeCompare(b.firstVerifiedAt) ||
            a.walletAddress.localeCompare(b.walletAddress)
          )
          .slice(0, 100)
          .map((entry, index) => ({
            rank: index + 1,
            walletLabel: maskWalletAddress(entry.walletAddress),
            verifiedQuests: entry.verifiedQuests,
            firstVerifiedAt: entry.firstVerifiedAt,
            latestVerifiedAt: entry.latestVerifiedAt
          }));

        return sendJson(response, 200, { leaderboard: ranked });
      }

      if (request.method === "GET" && url.pathname === "/api/completions") {
        const wallet = normalizeWalletAddress(url.searchParams.get("wallet"));
        if (!wallet) {
          return sendJson(response, 400, { error: "A valid Nimiq wallet address is required." });
        }
        const completions = getCompletionStore()
          .values()
          .filter((proof) => proof.walletAddress === wallet)
          .map(toPublicProof);
        return sendJson(response, 200, { completions });
      }

      const completionMatch = url.pathname.match(/^\/api\/completions\/([^/]+)$/);
      if (request.method === "GET" && completionMatch) {
        const publicId = decodeURIComponent(completionMatch[1]);
        const proof = getCompletionStore().values().find((item) => item.key === publicId);
        return proof
          ? sendJson(response, 200, { proof: toPublicProof(proof) })
          : sendJson(response, 404, { error: "Verified completion not found." });
      }

      const questMatch = url.pathname.match(/^\/api\/quests\/([^/]+)$/);
      if (request.method === "GET" && questMatch) {
        const quest = getQuest(questMatch[1]);

        if (!quest) {
          return sendJson(response, 404, {
            error: "Quest not found."
          });
        }

        return sendJson(response, 200, {
          quest
        });
      }

      if (request.method === "POST" && url.pathname === "/api/completion-challenges") {
        const body = await readJson(request);
        const result = createCompletionChallenge(body);

        if (!result.ok) {
          return sendJson(response, result.status, { error: result.error });
        }

        return sendJson(response, 201, result);
      }

      if (request.method === "POST" && url.pathname === "/api/grade") {
        const body = await readJson(request);
        const result = checkQuestAnswers(body);

        if (!result.ok) {
          return sendJson(response, result.status, { error: result.error });
        }

        return sendJson(response, 200, result);
      }

      if (request.method === "POST" && url.pathname === "/api/complete") {
        const body = await readJson(request);
        const result = gradeQuest(body);

        if (!result.ok && result.status) {
          return sendJson(response, result.status, {
            error: result.error
          });
        }

        return sendJson(response, 200, result);
      }

      if (request.method === "POST" && url.pathname === "/api/feedback") {
        const body = await readJson(request);
        const proof = getCompletionStore().values().find((item) => item.key === body.proofKey);
        if (!proof) {
          return sendJson(response, 404, { error: "Verified completion not found." });
        }
        if (
          typeof body.feedbackToken !== "string" ||
          !isMatchingToken(body.feedbackToken, proof.feedbackTokenHash)
        ) {
          return sendJson(response, 403, { error: "Feedback authorization is invalid." });
        }
        if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 3) {
          return sendJson(response, 400, { error: "Feedback rating must be between 1 and 3." });
        }
        return sendJson(response, 201, { ok: true, message: "Feedback saved." });
      }

      if (url.pathname.startsWith("/api/")) {
        return sendJson(response, 404, {
          error: "Route not found."
        });
      }

      if (request.method === "GET" || request.method === "HEAD") {
        return sendFrontend(request, response, url.pathname);
      }

      return sendJson(response, 404, { error: "Route not found." });
    } catch (error) {
      return sendJson(response, 500, {
        error: "Unexpected server error.",
        detail: error instanceof Error ? error.message : String(error)
      });
    }
  });
}

function toPublicProof(proof) {
  const quest = getQuest(proof.questId);
  return {
    key: proof.key,
    questId: proof.questId,
    questTitle: quest?.title || proof.questId,
    track: quest?.track || null,
    difficulty: quest?.difficulty || null,
    walletAddress: maskWalletAddress(proof.walletAddress),
    verificationMethod: proof.verificationMethod,
    completedAt: proof.completedAt,
    status: proof.status,
    reward: proof.reward
  };
}

function maskWalletAddress(value) {
  const compact = String(value || "").replace(/\s+/g, "");
  return `${compact.slice(0, 8)}${"*".repeat(10)}`;
}

function isMatchingToken(token, expectedHash) {
  if (typeof expectedHash !== "string") return false;
  const actualHash = crypto.createHash("sha256").update(token).digest("hex");
  if (actualHash.length !== expectedHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(actualHash), Buffer.from(expectedHash));
}

function sendFrontend(request, response, pathname) {
  if (!fs.existsSync(DIST_ROOT)) {
    return sendJson(response, 503, {
      error: "Frontend build unavailable. Run npm run build:web first."
    });
  }

  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const relativePath = requestedPath.replace(/^\/+/, "");
  const candidate = path.resolve(DIST_ROOT, relativePath);
  const insideDist = candidate === DIST_ROOT || candidate.startsWith(`${DIST_ROOT}${path.sep}`);
  const filePath = insideDist && fs.existsSync(candidate) && fs.statSync(candidate).isFile()
    ? candidate
    : path.join(DIST_ROOT, "index.html");
  const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";

  response.writeHead(200, {
    "content-type": contentType,
    "cache-control": filePath.endsWith("index.html")
      ? "no-cache"
      : "public, max-age=31536000, immutable"
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  fs.createReadStream(filePath).pipe(response);
}

function sendJson(response, statusCode, payload) {
  const body = payload === null ? "" : JSON.stringify(payload);

  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer"
  });
  response.end(body);
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  createServer().listen(PORT, () => {
    console.log(`NimQuest API listening on http://localhost:${PORT}`);
  });
}

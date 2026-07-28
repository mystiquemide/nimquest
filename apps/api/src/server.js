import http from "node:http";
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
        const proof = getCompletionStore().get(decodeURIComponent(completionMatch[1]));
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
        const proof = getCompletionStore().get(body.proofKey);
        if (!proof) {
          return sendJson(response, 404, { error: "Verified completion not found." });
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
  return {
    key: proof.key,
    questId: proof.questId,
    walletAddress: proof.walletAddress,
    verificationMethod: proof.verificationMethod,
    completedAt: proof.completedAt,
    status: proof.status,
    reward: proof.reward
  };
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
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type"
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

import http from "node:http";
import { getQuest, gradeQuest, listQuests } from "./quest-service.js";

const PORT = Number.parseInt(process.env.PORT || "8787", 10);

export function createServer() {
  return http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);

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

      return sendJson(response, 404, {
        error: "Route not found."
      });
    } catch (error) {
      return sendJson(response, 500, {
        error: "Unexpected server error.",
        detail: error instanceof Error ? error.message : String(error)
      });
    }
  });
}

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);

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

import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { createServer } from "../src/server.js";

let server;
let baseUrl;

describe("api server", () => {
  before(async () => {
    server = createServer();

    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });

    const address = server.address();
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });

  it("returns health status", async () => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
    assert.equal(body.service, "nimquest-api");
  });

  it("serves public quests without answer keys", async () => {
    const response = await fetch(`${baseUrl}/api/quests`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.quests.length, 7);
    assert.equal("answerIndex" in body.quests[0].questions[0], false);
  });

  it("serves sponsor-ready quest pools", async () => {
    const response = await fetch(`${baseUrl}/api/pools`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.pools.length, 2);
    assert.equal(body.pools[0].asset, "NIM");
  });

  it("serves public progress stats", async () => {
    const response = await fetch(`${baseUrl}/api/progress`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.progress.totalQuests, 7);
    assert.equal(Array.isArray(body.progress.quests), true);
  });

  it("handles CORS preflight", async () => {
    const response = await fetch(`${baseUrl}/api/quests`, {
      method: "OPTIONS"
    });

    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), "*");
  });
});

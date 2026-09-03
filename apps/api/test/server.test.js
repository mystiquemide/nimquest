import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { KeyPair } from "@nimiq/core";
import { createServer } from "../src/server.js";
import { findQuest } from "../src/quests.js";
import { signNimiqMessage } from "./nimiq-signature.js";

let server;
let baseUrl;

describe("api server", () => {
  before(async () => {
    server = createServer();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    });
  });

  it("returns health status", async () => {
    const response = await fetch(`${baseUrl}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.ok, true);
  });

  it("serves twenty public quests without answer keys", async () => {
    const response = await fetch(`${baseUrl}/api/quests`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.quests.length, 20);
    assert.equal("answerIndex" in body.quests[0].questions[0], false);
    assert.equal("explanation" in body.quests[0].questions[0], false);
  });

  it("creates and verifies a wallet-bound completion over HTTP", async () => {
    const keyPair = KeyPair.generate();
    const walletAddress = keyPair.toAddress().toUserFriendlyAddress();
    const challengeResponse = await fetch(`${baseUrl}/api/completion-challenges`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questId: "meet-nimiq",
        walletAddress
      })
    });
    const { challenge } = await challengeResponse.json();

    assert.equal(challengeResponse.status, 201);

    const completionResponse = await fetch(`${baseUrl}/api/complete`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questId: "meet-nimiq",
        walletAddress,
        challengeId: challenge.id,
        answers: correctAnswers("meet-nimiq"),
        publicKey: keyPair.publicKey.toHex(),
        signature: signNimiqMessage(keyPair, challenge.message)
      })
    });
    const completion = await completionResponse.json();

    assert.equal(completionResponse.status, 200);
    assert.equal(completion.verified, true);
    assert.equal(completion.proof.status, "verified");

    const [walletResponse, receiptResponse, feedbackResponse, leaderboardResponse] = await Promise.all([
      fetch(`${baseUrl}/api/completions?wallet=${encodeURIComponent(walletAddress)}`),
      fetch(`${baseUrl}/api/completions/${encodeURIComponent(completion.proof.key)}`),
      fetch(`${baseUrl}/api/feedback`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          proofKey: completion.proof.key,
          feedbackToken: completion.feedbackToken,
          rating: 3
        })
      }),
      fetch(`${baseUrl}/api/leaderboard`)
    ]);
    const walletProofs = await walletResponse.json();
    const receipt = await receiptResponse.json();
    const leaderboard = await leaderboardResponse.json();
    const leaderboardEntry = leaderboard.leaderboard.find(
      (entry) => entry.walletLabel === maskWalletAddress(walletAddress)
    );

    assert.equal(walletResponse.status, 200);
    assert.equal(walletProofs.completions.length, 1);
    assert.equal(receiptResponse.status, 200);
    assert.equal(receipt.proof.key, completion.proof.key);
    assert.equal("publicKey" in receipt.proof, false);
    assert.equal("deviceId" in receipt.proof, false);
    assert.equal(receipt.proof.walletAddress, maskWalletAddress(walletAddress));
    assert.equal(feedbackResponse.status, 201);
    assert.equal(leaderboardResponse.status, 200);
    assert.equal(leaderboardEntry.verifiedQuests, 1);
    assert.ok(leaderboardEntry.rank >= 1);

    const unauthorizedFeedback = await fetch(`${baseUrl}/api/feedback`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        proofKey: completion.proof.key,
        feedbackToken: "0".repeat(64),
        rating: 1
      })
    });
    assert.equal(unauthorizedFeedback.status, 403);
  });

  it("grades a quiz before wallet access is requested", async () => {
    const answers = correctAnswers("meet-nimiq");
    const secondQuestion = findQuest("meet-nimiq").questions[1];
    answers[1] = (answers[1] + 1) % secondQuestion.options.length;

    const response = await fetch(`${baseUrl}/api/grade`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        questId: "meet-nimiq",
        answers
      })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.passed, false);
    assert.equal(body.score, 2);
    assert.equal(body.feedback[1].correct, false);
    assert.equal("answerIndex" in body.feedback[1], false);
  });

  it("does not expose unverified pool or public progress routes", async () => {
    const [pools, progress, claims] = await Promise.all([
      fetch(`${baseUrl}/api/pools`),
      fetch(`${baseUrl}/api/progress`),
      fetch(`${baseUrl}/api/claim-intents`, { method: "POST" })
    ]);

    assert.equal(pools.status, 404);
    assert.equal(progress.status, 404);
    assert.equal(claims.status, 404);
  });

  it("serves the built frontend and supports deep-link routes", async () => {
    const [home, proof] = await Promise.all([
      fetch(`${baseUrl}/`),
      fetch(`${baseUrl}/proof/meet-nimiq`)
    ]);

    assert.equal(home.status, 200);
    assert.match(home.headers.get("content-type"), /text\/html/);
    assert.equal(proof.status, 200);
    assert.match(await proof.text(), /<div id="app"><\/div>/);
  });

  it("handles CORS preflight", async () => {
    const response = await fetch(`${baseUrl}/api/quests`, {
      method: "OPTIONS",
      headers: { origin: "http://localhost:5173" }
    });

    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:5173");
  });

  it("rejects cross-origin browser writes", async () => {
    const response = await fetch(`${baseUrl}/api/grade`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://attacker.example"
      },
      body: JSON.stringify({
        questId: "meet-nimiq",
        answers: [0, 0, 0]
      })
    });

    assert.equal(response.status, 403);
  });
});

function correctAnswers(questId) {
  return findQuest(questId).questions.map((question) => question.answerIndex);
}

function maskWalletAddress(value) {
  return `${value.replace(/\s+/g, "").slice(0, 8)}${"*".repeat(10)}`;
}

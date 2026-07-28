import assert from "node:assert/strict";
import { KeyPair } from "@nimiq/core";
import { signNimiqMessage } from "../apps/api/test/nimiq-signature.js";

const baseUrl = process.env.NIMQUEST_WORKER_URL || "http://127.0.0.1:8790";
const keyPair = KeyPair.generate();
const walletAddress = keyPair.toAddress().toUserFriendlyAddress();

const [healthResponse, questsResponse, deepLinkResponse] = await Promise.all([
  fetch(`${baseUrl}/health`),
  fetch(`${baseUrl}/api/quests`),
  fetch(`${baseUrl}/proof/meet-nimiq`)
]);

assert.equal(healthResponse.status, 200);
assert.equal((await healthResponse.json()).service, "nimquest-worker");
assert.equal(questsResponse.status, 200);
assert.equal((await questsResponse.json()).quests.length, 20);
assert.equal(deepLinkResponse.status, 200);
assert.match(await deepLinkResponse.text(), /<div id="app"><\/div>/);

const challengeResponse = await fetch(`${baseUrl}/api/completion-challenges`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    questId: "receive-nim-safely",
    walletAddress
  })
});
const { challenge } = await challengeResponse.json();
assert.equal(challengeResponse.status, 201);

const completionPayload = {
  questId: "receive-nim-safely",
  walletAddress,
  challengeId: challenge.id,
  answers: [0, 0, 0],
  publicKey: keyPair.publicKey.toHex(),
  signature: signNimiqMessage(keyPair, challenge.message)
};
const completionResponse = await fetch(`${baseUrl}/api/complete`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(completionPayload)
});
const completion = await completionResponse.json();

assert.equal(completionResponse.status, 200);
assert.equal(completion.verified, true);
assert.equal(completion.proof.walletAddress, walletAddress);

const [walletResponse, receiptResponse, feedbackResponse, replayResponse, leaderboardResponse] = await Promise.all([
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
  fetch(`${baseUrl}/api/complete`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(completionPayload)
  }),
  fetch(`${baseUrl}/api/leaderboard`)
]);
const walletProofs = await walletResponse.json();
const receipt = await receiptResponse.json();
const replay = await replayResponse.json();
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
assert.equal(replayResponse.status, 400);
assert.match(replay.error, /already been used/);
assert.equal(leaderboardResponse.status, 200);
assert.equal(leaderboardEntry.verifiedQuests, 1);
assert.ok(leaderboardEntry.rank >= 1);

const unauthorizedFeedbackResponse = await fetch(`${baseUrl}/api/feedback`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    proofKey: completion.proof.key,
    feedbackToken: "0".repeat(64),
    rating: 1
  })
});
assert.equal(unauthorizedFeedbackResponse.status, 403);

console.log(JSON.stringify({
  health: "passed",
  quests: 20,
  deepLink: "passed",
  nimiqSignature: "passed",
  d1Persistence: "passed",
  journeyRecovery: "passed",
  sharedReceipt: "passed",
  feedback: "passed",
  feedbackAuthorization: "passed",
  leaderboard: "passed",
  replayProtection: "passed"
}, null, 2));

function maskWalletAddress(value) {
  return `${value.replace(/\s+/g, "").slice(0, 8)}${"*".repeat(10)}`;
}

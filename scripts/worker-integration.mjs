import assert from "node:assert/strict";
import { KeyPair } from "@nimiq/core";
import { signNimiqMessage } from "../apps/api/test/nimiq-signature.js";
import { findQuest } from "../apps/api/src/quests.js";

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

const gradeResponse = await fetch(`${baseUrl}/api/grade`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    questId: "receive-nim-safely",
    answers: correctAnswers("receive-nim-safely")
  })
});
const grade = await gradeResponse.json();
assert.equal(gradeResponse.status, 200);
assert.equal(grade.passed, true);

const failedAnswers = correctAnswers("meet-nimiq");
failedAnswers[0] = (failedAnswers[0] + 1) % findQuest("meet-nimiq").questions[0].options.length;
const failedGradeResponse = await fetch(`${baseUrl}/api/grade`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    questId: "meet-nimiq",
    answers: failedAnswers
  })
});
const failedGrade = await failedGradeResponse.json();
assert.equal(failedGradeResponse.status, 200);
assert.equal(failedGrade.passed, false);

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
  answers: correctAnswers("receive-nim-safely"),
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

const [walletResponse, receiptResponse, feedbackResponse, replayResponse, leaderboardResponse, communityResponse] = await Promise.all([
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
  fetch(`${baseUrl}/api/leaderboard`),
  fetch(`${baseUrl}/api/community`)
]);
const walletProofs = await walletResponse.json();
const receipt = await receiptResponse.json();
const replay = await replayResponse.json();
const leaderboard = await leaderboardResponse.json();
const community = await communityResponse.json();
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
assert.equal(receipt.proof.questTitle, "Receive NIM Safely");
assert.equal(receipt.proof.track, "payments");
assert.equal(receipt.proof.difficulty, "starter");

const receiptPageResponse = await fetch(
  `${baseUrl}/completions/${encodeURIComponent(completion.proof.key)}`
);
const receiptPageHtml = await receiptPageResponse.text();
assert.equal(receiptPageResponse.status, 200);
assert.match(receiptPageHtml, /Receive NIM Safely · Verified NimQuest receipt/);
assert.match(receiptPageHtml, /Verified completion of Receive NIM Safely on NimQuest/);
assert.ok(
  receiptPageHtml.includes(`${baseUrl}/completions/${encodeURIComponent(completion.proof.key)}`),
  "receipt HTML must expose its canonical public URL"
);
assert.equal(
  receiptPageHtml.includes(walletAddress),
  false,
  "receipt social metadata must not expose the wallet address"
);
assert.equal(
  receiptPageHtml.includes(maskWalletAddress(walletAddress)),
  false,
  "receipt social metadata must not expose the masked wallet either"
);

const missingReceiptPageResponse = await fetch(`${baseUrl}/completions/not-a-real-receipt`);
const missingReceiptPageHtml = await missingReceiptPageResponse.text();
assert.equal(missingReceiptPageResponse.status, 200);
assert.match(missingReceiptPageHtml, /NimQuest - Learn Nimiq by doing/);

assert.equal(feedbackResponse.status, 201);
assert.equal(replayResponse.status, 400);
assert.match(replay.error, /already been used/);
assert.equal(leaderboardResponse.status, 200);
assert.equal(leaderboardEntry.verifiedQuests, 1);
assert.ok(leaderboardEntry.rank >= 1);
assert.equal(communityResponse.status, 200);
assert.equal(community.summary.verifiedCompletions, 1);
assert.equal(community.summary.participatingWallets, 1);
assert.equal(community.summary.activeQuests, 1);
assert.equal(community.funnel.quizAttempts, 2);
assert.equal(community.funnel.quizPasses, 1);
assert.equal(community.funnel.proofStarts, 1);
assert.equal(community.funnel.verifiedCompletions, 1);
assert.equal(community.funnel.passRate, 50);
assert.equal(community.funnel.proofStartRate, 100);
assert.equal(community.funnel.verificationRate, 100);
assert.match(community.funnel.trackingSince, /^\d{4}-\d{2}-\d{2}$/);
assert.equal("walletAddress" in community.funnel, false);
assert.equal("deviceId" in community.funnel, false);
assert.equal("ip" in community.funnel, false);
const receiveFunnel = community.questFunnels.find((entry) => entry.questId === "receive-nim-safely");
const meetFunnel = community.questFunnels.find((entry) => entry.questId === "meet-nimiq");
assert.ok(receiveFunnel);
assert.equal(receiveFunnel.questTitle, "Receive NIM Safely");
assert.equal(receiveFunnel.quizAttempts, 1);
assert.equal(receiveFunnel.quizPasses, 1);
assert.equal(receiveFunnel.proofStarts, 1);
assert.equal(receiveFunnel.verifiedCompletions, 1);
assert.equal(receiveFunnel.passRate, 100);
assert.equal(receiveFunnel.verificationRate, 100);
assert.ok(meetFunnel);
assert.equal(meetFunnel.quizAttempts, 1);
assert.equal(meetFunnel.quizPasses, 0);
assert.equal(meetFunnel.proofStarts, 0);
assert.equal(meetFunnel.verifiedCompletions, 0);
assert.equal(meetFunnel.passRate, 0);
assert.equal(meetFunnel.proofStartRate, null);
assert.equal(meetFunnel.verificationRate, null);
assert.equal("walletAddress" in receiveFunnel, false);
assert.equal("deviceId" in receiveFunnel, false);
assert.equal("answers" in receiveFunnel, false);
assert.equal(community.popularQuests[0].questId, "receive-nim-safely");
assert.equal(community.popularQuests[0].verifiedCompletions, 1);
assert.equal(community.recentActivity[0].receiptId, completion.proof.key);
assert.equal(community.recentActivity[0].walletLabel, maskWalletAddress(walletAddress));
assert.equal("walletAddress" in community.recentActivity[0], false);

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
  receiptSocialMetadata: "passed",
  feedback: "passed",
  feedbackAuthorization: "passed",
  leaderboard: "passed",
  communityActivity: "passed",
  aggregateLearningFunnel: "passed",
  perQuestLearningFunnel: "passed",
  replayProtection: "passed"
}, null, 2));

function correctAnswers(questId) {
  return findQuest(questId).questions.map((question) => question.answerIndex);
}

function maskWalletAddress(value) {
  return `${value.replace(/\s+/g, "").slice(0, 8)}${"*".repeat(10)}`;
}

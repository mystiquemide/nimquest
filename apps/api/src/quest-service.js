import crypto from "node:crypto";
import { ChallengeStore } from "./challenge-store.js";
import { CompletionStore } from "./completion-store.js";
import {
  checkQuestAnswers,
  getQuest,
  listQuests
} from "./quest-content-service.js";
import { findQuest } from "./quests.js";
import { normalizeWalletAddress } from "./validation.js";
import { verifyWalletProof } from "./wallet-proof-service.js";

let completionStore = new CompletionStore();
let challengeStore = new ChallengeStore();

export function createCompletionChallenge({ questId, walletAddress }) {
  if (!findQuest(questId)) {
    return { ok: false, status: 404, error: "Quest not found." };
  }

  const normalizedWallet = normalizeWalletAddress(walletAddress);
  if (!normalizedWallet) {
    return { ok: false, status: 400, error: "A valid Nimiq wallet address is required." };
  }

  return {
    ok: true,
    challenge: challengeStore.issue({
      questId,
      walletAddress: normalizedWallet
    })
  };
}

export function gradeQuest({
  questId,
  answers,
  walletAddress,
  challengeId,
  publicKey,
  signature
}) {
  const quest = findQuest(questId);
  const grading = checkQuestAnswers({ questId, answers });

  if (!grading.ok) {
    return grading;
  }

  if (!grading.passed) {
    return {
      ...grading,
      verified: false,
      message: "Review the lesson and try again."
    };
  }

  const pending = challengeStore.getValid(challengeId);
  if (!pending.ok) {
    return { ok: false, status: 400, error: pending.error };
  }

  const challenge = pending.challenge;
  if (challenge.questId !== questId) {
    return { ok: false, status: 400, error: "Challenge does not belong to this quest." };
  }

  const walletProof = verifyWalletProof({
    challenge,
    walletAddress,
    publicKey,
    signature
  });

  if (!walletProof.ok) {
    return { ok: false, status: 401, error: walletProof.error };
  }

  const consumed = challengeStore.consume(challengeId);
  if (!consumed.ok) {
    return { ok: false, status: 409, error: consumed.error };
  }

  const key = `${questId}:${walletProof.walletAddress}`;
  const feedbackToken = crypto.randomBytes(32).toString("hex");
  const feedbackTokenHash = crypto.createHash("sha256").update(feedbackToken).digest("hex");
  if (completionStore.has(key)) {
    const existing = completionStore.get(key);
    existing.feedbackTokenHash = feedbackTokenHash;
    completionStore.set(key, existing);
    return {
      ok: true,
      passed: true,
      verified: true,
      newlyCompleted: false,
      score: grading.score,
      total: grading.total,
      proof: existing,
      feedbackToken,
      message: "Quest was already verified for this wallet."
    };
  }

  const proof = {
    key: crypto.randomUUID(),
    questId,
    walletAddress: walletProof.walletAddress,
    publicKey: walletProof.publicKey,
    feedbackTokenHash,
    verificationMethod: "nimiq_message_signature",
    completedAt: new Date().toISOString(),
    status: "verified",
    reward: { status: "unavailable", asset: null, amount: null }
  };

  completionStore.set(key, proof);

  return {
    ok: true,
    passed: true,
    verified: true,
    newlyCompleted: true,
    score: grading.score,
    total: grading.total,
    proof,
    feedbackToken,
    message: "Quest completion verified."
  };
}

export function resetStores() {
  completionStore.clear();
  challengeStore.clear();
}

export function getCompletionStore() {
  return completionStore;
}

export function useCompletionStore(store) {
  completionStore = store;
}

export function useChallengeStore(store) {
  challengeStore = store;
}

export { checkQuestAnswers, getQuest, listQuests };

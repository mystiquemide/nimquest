import { ChallengeStore } from "./challenge-store.js";
import { CompletionStore } from "./completion-store.js";
import { findQuest, publicQuest, quests } from "./quests.js";
import { normalizeDeviceId, normalizeWalletAddress } from "./validation.js";
import { verifyWalletProof } from "./wallet-proof-service.js";

let completionStore = new CompletionStore();
let challengeStore = new ChallengeStore();

export function listQuests() {
  return quests.map(publicQuest);
}

export function getQuest(questId) {
  const quest = findQuest(questId);
  return quest ? publicQuest(quest) : null;
}

export function createCompletionChallenge({ questId, walletAddress, deviceId }) {
  if (!findQuest(questId)) {
    return { ok: false, status: 404, error: "Quest not found." };
  }

  const normalizedWallet = normalizeWalletAddress(walletAddress);
  if (!normalizedWallet) {
    return { ok: false, status: 400, error: "A valid Nimiq wallet address is required." };
  }

  const normalizedDevice = normalizeDeviceId(deviceId);
  if (!normalizedDevice) {
    return {
      ok: false,
      status: 400,
      error: "Device identifier must be a 64-character hex string when provided."
    };
  }

  return {
    ok: true,
    challenge: challengeStore.issue({
      questId,
      walletAddress: normalizedWallet,
      deviceId: normalizedDevice
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

  if (!quest) {
    return { ok: false, status: 404, error: "Quest not found." };
  }

  if (!Array.isArray(answers) || answers.length !== quest.questions.length) {
    return { ok: false, status: 400, error: "Submit one answer for every question." };
  }

  const score = answers.filter(
    (answer, index) => answer === quest.questions[index].answerIndex
  ).length;

  if (score !== quest.questions.length) {
    return {
      ok: true,
      passed: false,
      verified: false,
      score,
      total: quest.questions.length,
      feedback: quest.questions.map((question, index) => ({
        questionId: question.id,
        correct: answers[index] === question.answerIndex,
        explanation: question.explanation
      })),
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
  if (completionStore.has(key)) {
    return {
      ok: true,
      passed: true,
      verified: true,
      newlyCompleted: false,
      score,
      total: quest.questions.length,
      proof: completionStore.get(key),
      message: "Quest was already verified for this wallet."
    };
  }

  const proof = {
    key,
    questId,
    walletAddress: walletProof.walletAddress,
    deviceId: challenge.deviceId,
    publicKey: walletProof.publicKey,
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
    score,
    total: quest.questions.length,
    proof,
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

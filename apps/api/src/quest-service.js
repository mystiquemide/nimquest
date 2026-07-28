import { findQuest, publicQuest, quests } from "./quests.js";
import { CompletionStore } from "./completion-store.js";
import { normalizeDeviceId, normalizeWalletAddress } from "./validation.js";

let completionStore = new CompletionStore();

export function listQuests() {
  return quests.map(publicQuest);
}

export function getQuest(questId) {
  const quest = findQuest(questId);
  return quest ? publicQuest(quest) : null;
}

export function gradeQuest({ questId, answers, walletAddress, deviceId }) {
  const quest = findQuest(questId);

  if (!quest) {
    return {
      ok: false,
      status: 404,
      error: "Quest not found."
    };
  }

  if (!Array.isArray(answers) || answers.length !== quest.questions.length) {
    return {
      ok: false,
      status: 400,
      error: "Submit one answer for every question."
    };
  }

  const normalizedWallet = normalizeWalletAddress(walletAddress);

  if (!normalizedWallet) {
    return {
      ok: false,
      status: 400,
      error: "A valid Nimiq or EVM wallet address is required for quest proof."
    };
  }

  const normalizedDevice = normalizeDeviceId(deviceId);

  if (!normalizedDevice) {
    return {
      ok: false,
      status: 400,
      error: "Device identifier must be a 64-character hex string when provided."
    };
  }

  const correct = quest.questions.every((question, index) => {
    return answers[index] === question.answerIndex;
  });

  if (!correct) {
    return {
      ok: true,
      passed: false,
      rewardEligible: false,
      score: answers.filter((answer, index) => answer === quest.questions[index].answerIndex).length,
      total: quest.questions.length,
      message: "Review the lesson and try again."
    };
  }

  const proof = createCompletionProof({
    questId,
    walletAddress: normalizedWallet,
    deviceId: normalizedDevice,
    rewardNim: quest.rewardNim
  });

  if (completionStore.has(proof.key)) {
    return {
      ok: true,
      passed: true,
      rewardEligible: false,
      score: quest.questions.length,
      total: quest.questions.length,
      proof: completionStore.get(proof.key),
      message: "Quest already completed for this wallet."
    };
  }

  completionStore.set(proof.key, proof);

  return {
    ok: true,
    passed: true,
    rewardEligible: true,
    score: quest.questions.length,
    total: quest.questions.length,
    proof,
    message: "Quest completed. Reward claim can be prepared."
  };
}

export function resetCompletionStore() {
  completionStore.clear();
}

export function useCompletionStore(store) {
  completionStore = store;
}

function createCompletionProof({ questId, walletAddress, deviceId, rewardNim }) {
  const completedAt = new Date().toISOString();
  const key = `${questId}:${walletAddress}`;

  return {
    key,
    questId,
    walletAddress,
    deviceId,
    rewardNim,
    completedAt,
    status: "ready_for_wallet_claim"
  };
}

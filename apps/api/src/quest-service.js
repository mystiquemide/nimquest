import { findQuest, publicQuest, quests } from "./quests.js";

const completionStore = new Map();

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

  if (!walletAddress || typeof walletAddress !== "string") {
    return {
      ok: false,
      status: 400,
      error: "Wallet address is required for quest proof."
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
    walletAddress,
    deviceId,
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

function createCompletionProof({ questId, walletAddress, deviceId, rewardNim }) {
  const normalizedWallet = walletAddress.trim();
  const normalizedDevice = typeof deviceId === "string" ? deviceId.trim() : "unknown-device";
  const completedAt = new Date().toISOString();
  const key = `${questId}:${normalizedWallet}`;

  return {
    key,
    questId,
    walletAddress: normalizedWallet,
    deviceId: normalizedDevice,
    rewardNim,
    completedAt,
    status: "ready_for_wallet_claim"
  };
}

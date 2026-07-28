import { findQuest, publicQuest, quests } from "./quests.js";

export function listQuests() {
  return quests.map(publicQuest);
}

export function getQuest(questId) {
  const quest = findQuest(questId);
  return quest ? publicQuest(quest) : null;
}

export function checkQuestAnswers({ questId, answers }) {
  const quest = findQuest(questId);

  if (!quest) {
    return { ok: false, status: 404, error: "Quest not found." };
  }

  if (!Array.isArray(answers) || answers.length !== quest.questions.length) {
    return { ok: false, status: 400, error: "Submit one answer for every question." };
  }

  const validAnswers = answers.every(
    (answer, index) =>
      Number.isInteger(answer) &&
      answer >= 0 &&
      answer < quest.questions[index].options.length
  );

  if (!validAnswers) {
    return { ok: false, status: 400, error: "One or more answers are invalid." };
  }

  const feedback = quest.questions.map((question, index) => ({
    questionId: question.id,
    correct: answers[index] === question.answerIndex,
    explanation: question.explanation
  }));
  const score = feedback.filter((item) => item.correct).length;

  return {
    ok: true,
    passed: score === quest.questions.length,
    score,
    total: quest.questions.length,
    feedback,
    message:
      score === quest.questions.length
        ? "All answers are correct. Wallet proof is ready."
        : "Review the marked answers and try again."
  };
}

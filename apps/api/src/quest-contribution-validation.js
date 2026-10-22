// Shared by the public quest loader and the contributor CLI. Keep this Worker-safe.
const QUEST_FIELDS = [
  "id", "title", "track", "audience", "difficulty", "estimatedSeconds",
  "reward", "learningGoals", "lesson", "sourceUrl", "questions"
];
const QUESTION_FIELDS = ["id", "prompt", "options", "answerIndex", "explanation"];

function object(value, label, allowed) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(label + " must be an object.");
  }
  const extra = Object.keys(value).filter((key) => !allowed.includes(key));
  if (extra.length) throw new Error(label + " has unsupported fields: " + extra.join(", ") + ".");
}

function text(value, label, min, max) {
  if (typeof value !== "string" || value.trim() !== value ||
      value.length < min || value.length > max ||
      /[<>&"]|[\u0000-\u001f\u007f]/.test(value) || /\bTODO\b/i.test(value)) {
    throw new Error(label + " must be " + min + "-" + max + " characters of safe plain text without TODO placeholders.");
  }
}

function id(value, label) {
  if (typeof value !== "string" || value.length > 64 ||
      !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(label + " must be a lowercase, hyphenated slug (max 64 characters).");
  }
}

export function validateQuestContribution(quest, reservedIds = []) {
  object(quest, "Quest", QUEST_FIELDS);
  for (const field of QUEST_FIELDS) {
    if (!Object.hasOwn(quest, field)) throw new Error("Quest is missing " + field + ".");
  }
  id(quest.id, "Quest ID");
  if (reservedIds.includes(quest.id)) throw new Error("Quest ID " + quest.id + " already exists.");
  text(quest.title, "Quest title", 8, 90);
  if (!["merchants", "builders"].includes(quest.track)) {
    throw new Error("Contributed quests must use the Merchants or Builders track for now.");
  }
  if (quest.audience !== (quest.track === "merchants" ? "merchant" : "developer")) {
    throw new Error("Quest audience must match its track.");
  }
  if (!["starter", "intermediate", "advanced"].includes(quest.difficulty)) {
    throw new Error("Invalid difficulty.");
  }
  if (!Number.isInteger(quest.estimatedSeconds) ||
      quest.estimatedSeconds < 30 || quest.estimatedSeconds > 600) {
    throw new Error("Estimated duration must be 30 to 600 seconds.");
  }
  object(quest.reward, "Reward", ["status", "asset", "amount"]);
  if (Object.keys(quest.reward).length !== 3 || quest.reward.status !== "unavailable" ||
      quest.reward.asset !== null || quest.reward.amount !== null) {
    throw new Error("Contributed quests cannot promise rewards: use unavailable/null/null.");
  }
  if (!Array.isArray(quest.learningGoals) || quest.learningGoals.length !== 2) {
    throw new Error("Exactly two learning goals are required.");
  }
  quest.learningGoals.forEach((goal, i) => text(goal, "Learning goal " + (i + 1), 15, 160));
  text(quest.lesson, "Lesson", 120, 1800);
  text(quest.sourceUrl, "Source URL", 12, 400);
  let source;
  try { source = new URL(quest.sourceUrl); } catch {
    throw new Error("Source URL must be an official Nimiq documentation URL.");
  }
  if (source.protocol !== "https:" ||
      !["nimiq.dev", "nimiq.com", "www.nimiq.com"].includes(source.hostname) ||
      source.username || source.password) {
    throw new Error("Source URL must be an official HTTPS Nimiq documentation URL.");
  }
  if (!Array.isArray(quest.questions) || quest.questions.length !== 3) {
    throw new Error("Exactly three questions are required.");
  }
  const questionIds = new Set();
  quest.questions.forEach((question, i) => {
    const label = "Question " + (i + 1);
    object(question, label, QUESTION_FIELDS);
    for (const field of QUESTION_FIELDS) {
      if (!Object.hasOwn(question, field)) throw new Error(label + " is missing " + field + ".");
    }
    id(question.id, label + " ID");
    if (questionIds.has(question.id)) throw new Error("Duplicate question ID " + question.id + ".");
    questionIds.add(question.id);
    text(question.prompt, label + " prompt", 15, 260);
    if (!Array.isArray(question.options) || question.options.length !== 3) {
      throw new Error(label + " needs exactly three options.");
    }
    question.options.forEach((option, j) => text(option, label + " option " + (j + 1), 2, 200));
    if (new Set(question.options.map((v) => v.toLowerCase())).size !== 3) {
      throw new Error(label + " answer options must be distinct.");
    }
    if (!Number.isInteger(question.answerIndex) ||
        question.answerIndex < 0 || question.answerIndex > 2) {
      throw new Error(label + " correct answer index must be 0, 1, or 2.");
    }
    text(question.explanation, label + " explanation", 20, 350);
  });
  return quest;
}

export function validateQuestContributionCatalog(catalog, reservedIds = []) {
  if (!Array.isArray(catalog) || catalog.length > 100) {
    throw new Error("Published contributions must be an array of at most 100 quests.");
  }
  const seen = [...reservedIds];
  return catalog.map((quest) => {
    const valid = validateQuestContribution(quest, seen);
    seen.push(valid.id);
    return valid;
  });
}

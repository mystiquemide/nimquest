import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { builtInQuestIds } from "../apps/api/src/quests.js";
import {
  validateQuestContribution,
  validateQuestContributionCatalog
} from "../apps/api/src/quest-contribution-validation.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const drafts = path.join(root, "contributions", "drafts");
const publishedFile = path.join(root, "contributions", "published-quests.json");
const [command, arg] = process.argv.slice(2);
const published = () => JSON.parse(fs.readFileSync(publishedFile, "utf8"));
const reserved = () => [...builtInQuestIds, ...published().map((quest) => quest.id)];

function loadDraft(file) {
  if (!file) throw new Error("Provide a path to a draft JSON file.");
  const draftPath = path.resolve(process.cwd(), file);
  if (!draftPath.startsWith(drafts + path.sep)) {
    throw new Error("Draft must be inside contributions/drafts/.");
  }
  return { draftPath, quest: JSON.parse(fs.readFileSync(draftPath, "utf8")) };
}

function makeDraft(slug) {
  if (!slug || !/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 64) {
    throw new Error("Provide a lowercase, hyphenated quest ID (max 64 chars).");
  }
  if (reserved().includes(slug)) throw new Error("Quest ID already published: " + slug);
  const draft = {
    id: slug,
    title: "TODO: Write a descriptive quest title",
    track: "builders",
    audience: "developer",
    difficulty: "intermediate",
    estimatedSeconds: 90,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: ["TODO: Explain what the learner will understand.", "TODO: Describe the practical safety or verification skill."],
    lesson: "TODO: Write an accurate, sourced lesson of at least 120 characters. Describe the practical workflow, what the learner should verify, and what could go wrong.",
    sourceUrl: "https://nimiq.dev/mini-apps/",
    questions: [1, 2, 3].map((index) => ({
      id: "question-" + index,
      prompt: "TODO: Write a meaningful knowledge-check question?",
      options: ["TODO: Correct answer", "TODO: Wrong answer one", "TODO: Wrong answer two"],
      answerIndex: 0,
      explanation: "TODO: Explain why the answer is correct using the source."
    }))
  };
  fs.mkdirSync(drafts, { recursive: true });
  const file = path.join(drafts, slug + ".json");
  fs.writeFileSync(file, JSON.stringify(draft, null, 2) + "\n", { flag: "wx" });
  console.log("Draft created: " + path.relative(root, file));
  console.log("Replace each TODO and run npm run quest:validate -- " + path.relative(root, file));
}

try {
  switch (command) {
    case "new": {
      makeDraft(arg);
      break;
    }
    case "validate":
    case "stage": {
      const { draftPath, quest } = loadDraft(arg);
      validateQuestContribution(quest, reserved());
      console.log("Valid sourced quest: " + quest.id);
      if (command === "stage") {
        const next = [...published(), quest];
        validateQuestContributionCatalog(next, builtInQuestIds);
        fs.writeFileSync(publishedFile, JSON.stringify(next, null, 2) + "\n");
        console.log("Staged in contributions/published-quests.json.");
        console.log("Open a pull request for maintainer review. Staging is not deployment.");
      }
      break;
    }
    case "check": {
      const all = validateQuestContributionCatalog(published(), builtInQuestIds);
      console.log("Validated " + all.length + " published community quest(s).");
      break;
    }
    default:
      throw new Error("Usage: quest-contributions.mjs new <slug> | validate <draft.json> | stage <draft.json> | check");
  }
} catch (error) {
  console.error("Quest contribution failed: " + error.message);
  process.exitCode = 1;
}

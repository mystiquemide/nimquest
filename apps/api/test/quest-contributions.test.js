import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  validateQuestContribution,
  validateQuestContributionCatalog
} from "../src/quest-contribution-validation.js";
import { builtInQuestIds, publicQuest, quests } from "../src/quests.js";

function example() {
  return {
    id: "review-mini-app-request",
    title: "Review a Mini App Wallet Request",
    track: "builders",
    audience: "developer",
    difficulty: "intermediate",
    estimatedSeconds: 90,
    reward: { status: "unavailable", asset: null, amount: null },
    learningGoals: [
      "Identify the wallet permission requested by a Mini App.",
      "Explain how to decline access without sharing wallet secrets."
    ],
    lesson: "A Mini App can request wallet actions, but approval belongs to the wallet owner. Developers should explain why access is needed, accept a refused request, and never ask for recovery words. Each approval should match the action the user intended before the application proceeds.",
    sourceUrl: "https://nimiq.dev/mini-apps/",
    questions: [
      {
        id: "request-purpose",
        prompt: "When is it appropriate to request an account permission?",
        options: ["Only when needed for a clear user action", "At every page load", "Without explaining the purpose"],
        answerIndex: 0,
        explanation: "Keep the request tied to user intent and explain what will happen."
      },
      {
        id: "denied-access",
        prompt: "What should the application do when the user denies access?",
        options: ["Respect the refusal and offer safe alternatives", "Retry continuously", "Ask for their recovery words"],
        answerIndex: 0,
        explanation: "Denied access is a valid outcome and must not lead to coercion."
      },
      {
        id: "private-key",
        prompt: "What should developers avoid asking users to provide?",
        options: ["Private keys and recovery words", "Public account addresses", "A description of their error"],
        answerIndex: 0,
        explanation: "Private secrets must always remain in the wallet, not a Mini App."
      }
    ]
  };
}

describe("reviewed community quest authoring", () => {
  it("accepts sourced and safe draft content and keeps keys off public quest surfaces", () => {
    const draft = example();
    assert.equal(validateQuestContribution(draft, builtInQuestIds), draft);
    assert.deepEqual(validateQuestContributionCatalog([draft], builtInQuestIds), [draft]);
    const exposed = publicQuest(draft);
    for (const question of exposed.questions) {
      assert.equal("answerIndex" in question, false);
      assert.equal("explanation" in question, false);
    }
    assert.equal(draft.questions[0].answerIndex, 0);
  });

  it("keeps already published IDs and repeated contribution IDs unique", () => {
    const draft = example();
    draft.id = builtInQuestIds[0];
    assert.throws(() => validateQuestContribution(draft, builtInQuestIds), /already exists/);
    const other = example();
    assert.throws(() => validateQuestContributionCatalog([other, structuredClone(other)], builtInQuestIds), /already exists/);
  });

  it("rejects unsafe markup, placeholders, false reward promises, and untrusted sources", () => {
    const draft = example();
    draft.title = "Unsafe <img src=x>";
    assert.throws(() => validateQuestContribution(draft), /safe plain text/);
    draft.title = "Review a Mini App Wallet Request";
    draft.lesson = "TODO: Enter an actual lesson";
    assert.throws(() => validateQuestContribution(draft), /safe plain text/);
    draft.lesson = example().lesson;
    draft.reward = { status: "funded", asset: "NIM", amount: 10 };
    assert.throws(() => validateQuestContribution(draft), /cannot promise rewards/);
    draft.reward = example().reward;
    draft.sourceUrl = "https://not-nimiq.dev/fake-guide";
    assert.throws(() => validateQuestContribution(draft), /official HTTPS Nimiq/);
    draft.sourceUrl = example().sourceUrl;
    draft.extraField = "surprise";
    assert.throws(() => validateQuestContribution(draft), /unsupported fields/);
  });

  it("rejects invalid quiz structures, duplicated options, and foundational audience changes", () => {
    const draft = example();
    draft.questions[0].options[1] = draft.questions[0].options[0];
    assert.throws(() => validateQuestContribution(draft), /must be distinct/);
    draft.questions[0].options = example().questions[0].options;
    draft.questions[0].answerIndex = 3;
    assert.throws(() => validateQuestContribution(draft), /index must be/);
    draft.questions[0].answerIndex = 0;
    draft.audience = "new-user";
    assert.throws(() => validateQuestContribution(draft), /audience must match/);
  });

  it("starts with no unreviewed contributions published", () => {
    assert.equal(quests.length, 23);
    assert.equal(validateQuestContributionCatalog([], builtInQuestIds).length, 0);
  });
});

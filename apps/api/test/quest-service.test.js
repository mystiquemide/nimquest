import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import {
  getQuest,
  gradeQuest,
  listQuests,
  resetCompletionStore
} from "../src/quest-service.js";

describe("quest service", () => {
  beforeEach(() => {
    resetCompletionStore();
  });

  it("lists public quests without exposing answer keys", () => {
    const quests = listQuests();

    assert.equal(quests.length, 3);
    assert.equal(quests[0].questions.length, 3);
    assert.equal("answerIndex" in quests[0].questions[0], false);
  });

  it("returns one public quest", () => {
    const quest = getQuest("wallet-basics");

    assert.equal(quest.id, "wallet-basics");
    assert.equal(quest.rewardNim, 1);
    assert.equal("answerIndex" in quest.questions[0], false);
  });

  it("grades a passing quest and returns completion proof", () => {
    const result = gradeQuest({
      questId: "wallet-basics",
      walletAddress: "NQ00 TEST WALLET",
      deviceId: "device-1",
      answers: [0, 1, 1]
    });

    assert.equal(result.ok, true);
    assert.equal(result.passed, true);
    assert.equal(result.rewardEligible, true);
    assert.equal(result.proof.status, "ready_for_wallet_claim");
  });

  it("blocks duplicate reward eligibility for the same wallet and quest", () => {
    const payload = {
      questId: "wallet-basics",
      walletAddress: "NQ00 TEST WALLET",
      deviceId: "device-1",
      answers: [0, 1, 1]
    };

    assert.equal(gradeQuest(payload).rewardEligible, true);
    assert.equal(gradeQuest(payload).rewardEligible, false);
  });

  it("fails incomplete answers", () => {
    const result = gradeQuest({
      questId: "wallet-basics",
      walletAddress: "NQ00 TEST WALLET",
      answers: [0]
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });
});

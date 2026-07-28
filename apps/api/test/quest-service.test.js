import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import os from "node:os";
import path from "node:path";
import { createClaimIntent } from "../src/claim-service.js";
import { CompletionStore } from "../src/completion-store.js";
import { listQuestPools } from "../src/pool-service.js";
import { getPublicProgress } from "../src/progress-service.js";
import {
  getCompletionStore,
  getQuest,
  gradeQuest,
  listQuests,
  resetCompletionStore,
  useCompletionStore
} from "../src/quest-service.js";

const validNimiqAddress = "NQ12 ABCD EFGH IJKL MNOP QRST UVWX YZ12 3456";
const validDeviceId = "a".repeat(64);

describe("quest service", () => {
  beforeEach(() => {
    const storePath = path.join(os.tmpdir(), `nimquest-test-${crypto.randomUUID()}.json`);
    useCompletionStore(new CompletionStore(storePath));
  });

  it("lists public quests without exposing answer keys", () => {
    const quests = listQuests();

    assert.equal(quests.length, 7);
    assert.equal(quests[0].questions.length, 3);
    assert.equal("answerIndex" in quests[0].questions[0], false);
    assert.equal(typeof quests[0].ecosystemUseCase, "string");
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
      walletAddress: validNimiqAddress,
      deviceId: validDeviceId,
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
      walletAddress: validNimiqAddress,
      deviceId: validDeviceId,
      answers: [0, 1, 1]
    };

    assert.equal(gradeQuest(payload).rewardEligible, true);
    assert.equal(gradeQuest(payload).rewardEligible, false);
  });

  it("fails incomplete answers", () => {
    const result = gradeQuest({
      questId: "wallet-basics",
      walletAddress: validNimiqAddress,
      answers: [0]
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });

  it("rejects invalid wallet addresses", () => {
    const result = gradeQuest({
      questId: "wallet-basics",
      walletAddress: "NQ00 TEST WALLET",
      answers: [0, 1, 1]
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });

  it("rejects invalid device identifiers when provided", () => {
    const result = gradeQuest({
      questId: "wallet-basics",
      walletAddress: validNimiqAddress,
      deviceId: "device-1",
      answers: [0, 1, 1]
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });

  it("persists completions across store instances", () => {
    const storePath = path.join(os.tmpdir(), `nimquest-persist-${crypto.randomUUID()}.json`);
    useCompletionStore(new CompletionStore(storePath));

    const payload = {
      questId: "wallet-basics",
      walletAddress: validNimiqAddress,
      deviceId: validDeviceId,
      answers: [0, 1, 1]
    };

    assert.equal(gradeQuest(payload).rewardEligible, true);

    useCompletionStore(new CompletionStore(storePath));

    assert.equal(gradeQuest(payload).rewardEligible, false);
    resetCompletionStore();
  });

  it("creates a claim intent from a valid completion proof", () => {
    const completeResult = gradeQuest({
      questId: "wallet-basics",
      walletAddress: validNimiqAddress,
      deviceId: validDeviceId,
      answers: [0, 1, 1]
    });

    const result = createClaimIntent({
      proofKey: completeResult.proof.key,
      walletAddress: validNimiqAddress,
      completionStore: getCompletionStore()
    });

    assert.equal(result.ok, true);
    assert.equal(result.claimIntent.asset, "NIM");
    assert.equal(result.claimIntent.amount, 1);
    assert.equal(result.claimIntent.status, "prepared");
  });

  it("blocks claim intents for mismatched wallets", () => {
    const completeResult = gradeQuest({
      questId: "wallet-basics",
      walletAddress: validNimiqAddress,
      deviceId: validDeviceId,
      answers: [0, 1, 1]
    });

    const result = createClaimIntent({
      proofKey: completeResult.proof.key,
      walletAddress: "0x1111111111111111111111111111111111111111",
      completionStore: getCompletionStore()
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 403);
  });

  it("lists sponsor-ready quest pools", () => {
    const pools = listQuestPools();

    assert.equal(pools.length, 2);
    assert.equal(pools[0].asset, "NIM");
    assert.equal(pools[0].fundingModel, "sponsor-funded quest pool");
    assert.equal(pools[0].questIds.includes("wallet-basics"), true);
  });

  it("returns public progress without exposing wallets", () => {
    gradeQuest({
      questId: "wallet-basics",
      walletAddress: validNimiqAddress,
      deviceId: validDeviceId,
      answers: [0, 1, 1]
    });

    const progress = getPublicProgress(getCompletionStore());

    assert.equal(progress.totalQuests, 7);
    assert.equal(progress.totalCompletions, 1);
    assert.equal(progress.uniqueWallets, 1);
    assert.equal(progress.rewardNimPrepared, 1);
    assert.equal("walletAddress" in progress.quests[0], false);
  });
});

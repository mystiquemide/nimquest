import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, it } from "node:test";
import { KeyPair } from "@nimiq/core";
import { signNimiqMessage } from "./nimiq-signature.js";
import { ChallengeStore } from "../src/challenge-store.js";
import { CompletionStore } from "../src/completion-store.js";
import {
  checkQuestAnswers,
  createCompletionChallenge,
  getQuest,
  gradeQuest,
  listQuests,
  useChallengeStore,
  useCompletionStore
} from "../src/quest-service.js";
import { findQuest, quests as canonicalQuests } from "../src/quests.js";
import { normalizeWalletAddress } from "../src/validation.js";

let keyPair;
let walletAddress;

describe("quest service", () => {
  beforeEach(() => {
    keyPair = KeyPair.generate();
    walletAddress = keyPair.toAddress().toUserFriendlyAddress();
    const storePath = path.join(os.tmpdir(), `nimquest-test-${crypto.randomUUID()}.json`);
    useCompletionStore(new CompletionStore(storePath));
    useChallengeStore(new ChallengeStore());
  });

  it("publishes twenty sourced quests without answer keys", () => {
    const quests = listQuests();

    assert.equal(quests.length, 20);
    assert.equal("answerIndex" in quests[0].questions[0], false);
    assert.equal("explanation" in quests[0].questions[0], false);
    assert.match(quests[0].sourceUrl, /^https:\/\/nimiq/);
    assert.equal(quests[0].reward.status, "unavailable");
  });

  it("returns one public quest without answer metadata", () => {
    const quest = getQuest("meet-nimiq");

    assert.equal(quest.id, "meet-nimiq");
    assert.equal("answerIndex" in quest.questions[0], false);
    assert.equal("explanation" in quest.questions[0], false);
  });

  it("distributes canonical correct answers across option positions", () => {
    const answerIndexes = canonicalQuests.flatMap((quest) =>
      quest.questions.map((question) => question.answerIndex)
    );

    assert.deepEqual([...new Set(answerIndexes)].sort(), [0, 1, 2]);
    assert.ok(answerIndexes.some((answerIndex) => answerIndex !== 0));
  });

  it("accepts generated Nimiq addresses and rejects EVM addresses", () => {
    assert.equal(normalizeWalletAddress(walletAddress), walletAddress);
    assert.equal(
      normalizeWalletAddress("0x1111111111111111111111111111111111111111"),
      null
    );
  });

  it("issues a short-lived challenge bound to quest and wallet", () => {
    const result = createCompletionChallenge({
      questId: "meet-nimiq",
      walletAddress
    });

    assert.equal(result.ok, true);
    assert.match(result.challenge.message, /Quest: meet-nimiq/);
    assert.match(result.challenge.message, new RegExp(walletAddress));
    assert.ok(Date.parse(result.challenge.expiresAt) > Date.now());
  });

  it("rejects challenges for unknown quests", () => {
    const result = createCompletionChallenge({
      questId: "missing",
      walletAddress
    });

    assert.equal(result.status, 404);
  });

  it("returns question-level guidance without consuming proof on a failed quiz", () => {
    const challenge = issueChallenge();
    const signed = sign(challenge.message);
    const result = gradeQuest({
      questId: "meet-nimiq",
      walletAddress,
      challengeId: challenge.id,
      answers: wrongAnswers("meet-nimiq"),
      ...signed
    });

    assert.equal(result.passed, false);
    assert.equal(result.verified, false);
    assert.equal(result.feedback.length, 3);
  });

  it("grades answers before wallet proof without exposing answer indexes", () => {
    const correct = correctAnswers("meet-nimiq");
    const failedAnswers = [...correct];
    const secondQuestion = findQuest("meet-nimiq").questions[1];
    failedAnswers[1] = (failedAnswers[1] + 1) % secondQuestion.options.length;

    const failed = checkQuestAnswers({
      questId: "meet-nimiq",
      answers: failedAnswers
    });
    const passed = checkQuestAnswers({
      questId: "meet-nimiq",
      answers: correct
    });

    assert.equal(failed.passed, false);
    assert.equal(failed.score, 2);
    assert.equal(failed.feedback[1].correct, false);
    assert.equal("answerIndex" in failed.feedback[1], false);
    assert.equal(passed.passed, true);
  });

  it("verifies a real Nimiq signature before storing completion", () => {
    const challenge = issueChallenge();
    const result = complete(challenge);

    assert.equal(result.ok, true);
    assert.equal(result.verified, true);
    assert.equal(result.newlyCompleted, true);
    assert.equal(result.proof.status, "verified");
    assert.equal(result.proof.verificationMethod, "nimiq_message_signature");
    assert.equal(result.proof.reward.status, "unavailable");
  });

  it("rejects a signature created by a different wallet", () => {
    const challenge = issueChallenge();
    const otherKeyPair = KeyPair.generate();
    const result = gradeQuest({
      questId: "meet-nimiq",
      walletAddress,
      challengeId: challenge.id,
      answers: correctAnswers("meet-nimiq"),
      publicKey: otherKeyPair.publicKey.toHex(),
      signature: signNimiqMessage(otherKeyPair, challenge.message)
    });

    assert.equal(result.status, 401);
    assert.match(result.error, /does not belong/);
  });

  it("rejects a signature over a changed message", () => {
    const challenge = issueChallenge();
    const result = gradeQuest({
      questId: "meet-nimiq",
      walletAddress,
      challengeId: challenge.id,
      answers: correctAnswers("meet-nimiq"),
      publicKey: keyPair.publicKey.toHex(),
      signature: signNimiqMessage(keyPair, `${challenge.message} changed`)
    });

    assert.equal(result.status, 401);
    assert.match(result.error, /invalid/);
  });

  it("blocks replay of an already consumed challenge", () => {
    const challenge = issueChallenge();
    assert.equal(complete(challenge).verified, true);

    const replay = complete(challenge);
    assert.equal(replay.status, 400);
    assert.match(replay.error, /already been used/);
  });

  it("blocks expired challenges", () => {
    let now = Date.now();
    useChallengeStore(new ChallengeStore({ ttlMs: 100, now: () => now }));
    const challenge = issueChallenge();
    now += 101;

    const result = complete(challenge);
    assert.equal(result.status, 400);
    assert.match(result.error, /expired/);
  });

  it("returns the existing verified proof for a duplicate quest completion", () => {
    const first = complete(issueChallenge());
    const second = complete(issueChallenge());

    assert.equal(first.newlyCompleted, true);
    assert.equal(second.newlyCompleted, false);
    assert.equal(second.proof.key, first.proof.key);
  });
});

function correctAnswers(questId) {
  return findQuest(questId).questions.map((question) => question.answerIndex);
}

function wrongAnswers(questId) {
  return findQuest(questId).questions.map(
    (question) => (question.answerIndex + 1) % question.options.length
  );
}

function issueChallenge() {
  const result = createCompletionChallenge({
    questId: "meet-nimiq",
      walletAddress
  });
  return result.challenge;
}

function sign(message) {
  return {
    publicKey: keyPair.publicKey.toHex(),
    signature: signNimiqMessage(keyPair, message)
  };
}

function complete(challenge) {
  return gradeQuest({
    questId: "meet-nimiq",
    walletAddress,
    challengeId: challenge.id,
    answers: correctAnswers("meet-nimiq"),
    ...sign(challenge.message)
  });
}

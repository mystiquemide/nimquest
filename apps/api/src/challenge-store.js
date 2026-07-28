import crypto from "node:crypto";

const DEFAULT_TTL_MS = 5 * 60 * 1000;

export class ChallengeStore {
  constructor({ ttlMs = DEFAULT_TTL_MS, now = () => Date.now() } = {}) {
    this.ttlMs = ttlMs;
    this.now = now;
    this.records = new Map();
  }

  issue({ questId, walletAddress }) {
    this.prune();

    const id = crypto.randomUUID();
    const nonce = crypto.randomBytes(32).toString("hex");
    const issuedAt = new Date(this.now()).toISOString();
    const expiresAt = new Date(this.now() + this.ttlMs).toISOString();
    const message = [
      "NimQuest completion proof",
      `Quest: ${questId}`,
      `Wallet: ${walletAddress}`,
      `Nonce: ${nonce}`,
      `Issued: ${issuedAt}`,
      `Expires: ${expiresAt}`
    ].join("\n");

    const challenge = {
      id,
      questId,
      walletAddress,
      message,
      issuedAt,
      expiresAt,
      usedAt: null
    };

    this.records.set(id, challenge);
    return publicChallenge(challenge);
  }

  getValid(id) {
    const challenge = this.records.get(id);

    if (!challenge) {
      return { ok: false, error: "Challenge not found." };
    }

    if (challenge.usedAt) {
      return { ok: false, error: "Challenge has already been used." };
    }

    if (Date.parse(challenge.expiresAt) <= this.now()) {
      this.records.delete(id);
      return { ok: false, error: "Challenge has expired." };
    }

    return { ok: true, challenge: { ...challenge } };
  }

  consume(id) {
    const result = this.getValid(id);
    if (!result.ok) {
      return result;
    }

    const challenge = this.records.get(id);
    challenge.usedAt = new Date(this.now()).toISOString();
    return { ok: true, challenge: { ...challenge } };
  }

  clear() {
    this.records.clear();
  }

  prune() {
    for (const [id, challenge] of this.records) {
      if (Date.parse(challenge.expiresAt) <= this.now()) {
        this.records.delete(id);
      }
    }
  }
}

function publicChallenge(challenge) {
  return {
    id: challenge.id,
    message: challenge.message,
    expiresAt: challenge.expiresAt
  };
}

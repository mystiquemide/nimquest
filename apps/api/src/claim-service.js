import { normalizeWalletAddress } from "./validation.js";

export function createClaimIntent({ proofKey, walletAddress, completionStore }) {
  if (!proofKey || typeof proofKey !== "string") {
    return {
      ok: false,
      status: 400,
      error: "Completion proof key is required."
    };
  }

  const normalizedWallet = normalizeWalletAddress(walletAddress);

  if (!normalizedWallet) {
    return {
      ok: false,
      status: 400,
      error: "A valid Nimiq or EVM wallet address is required for claim intent."
    };
  }

  const proof = completionStore.get(proofKey);

  if (!proof) {
    return {
      ok: false,
      status: 404,
      error: "Completion proof not found."
    };
  }

  if (proof.walletAddress !== normalizedWallet) {
    return {
      ok: false,
      status: 403,
      error: "Wallet address does not match completion proof."
    };
  }

  if (proof.status !== "ready_for_wallet_claim" && proof.status !== "claim_intent_prepared") {
    return {
      ok: false,
      status: 409,
      error: "Completion proof is not ready for claim intent."
    };
  }

  const claimIntent = {
    type: "nim_reward_claim",
    asset: "NIM",
    amount: proof.rewardNim,
    recipient: proof.walletAddress,
    questId: proof.questId,
    proofKey: proof.key,
    memo: `NimQuest reward for ${proof.questId}`,
    status: "prepared"
  };

  completionStore.set(proof.key, {
    ...proof,
    status: "claim_intent_prepared",
    claimIntent
  });

  return {
    ok: true,
    claimIntent
  };
}

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { KeyPair } from "@nimiq/core";
import {
  publicKeyToNimiqAddress,
  verifyWalletProofWorker
} from "../src/wallet-proof-worker.js";
import { signNimiqMessage } from "./nimiq-signature.js";

describe("worker wallet proof", () => {
  it("derives the same Nimiq address as the official core library", () => {
    for (let index = 0; index < 25; index += 1) {
      const keyPair = KeyPair.generate();
      const publicKeyBytes = fromHex(keyPair.publicKey.toHex());

      assert.equal(
        publicKeyToNimiqAddress(publicKeyBytes),
        keyPair.toAddress().toUserFriendlyAddress()
      );
    }
  });

  it("verifies an official Nimiq signature with Web Crypto", async () => {
    const keyPair = KeyPair.generate();
    const walletAddress = keyPair.toAddress().toUserFriendlyAddress();
    const challenge = {
      walletAddress,
      message: "NimQuest Worker signature cross-check"
    };

    const result = await verifyWalletProofWorker({
      challenge,
      walletAddress,
      publicKey: keyPair.publicKey.toHex(),
      signature: signNimiqMessage(keyPair, challenge.message)
    });

    assert.equal(result.ok, true);
    assert.equal(result.walletAddress, walletAddress);
  });

  it("rejects an altered message", async () => {
    const keyPair = KeyPair.generate();
    const walletAddress = keyPair.toAddress().toUserFriendlyAddress();
    const signedMessage = "Original message";

    const result = await verifyWalletProofWorker({
      challenge: {
        walletAddress,
        message: `${signedMessage} changed`
      },
      walletAddress,
      publicKey: keyPair.publicKey.toHex(),
      signature: signNimiqMessage(keyPair, signedMessage)
    });

    assert.equal(result.ok, false);
    assert.match(result.error, /invalid/);
  });
});

function fromHex(value) {
  return Uint8Array.from(
    value.match(/.{2}/g),
    (byte) => Number.parseInt(byte, 16)
  );
}

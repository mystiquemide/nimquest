import { Hash, PublicKey, Signature } from "@nimiq/core";
import { encodeNimiqSignedMessage } from "./nimiq-signed-message.js";
import { normalizeWalletAddress } from "./validation.js";

export function verifyWalletProof({ challenge, walletAddress, publicKey, signature }) {
  const normalizedWallet = normalizeWalletAddress(walletAddress);

  if (!normalizedWallet || normalizedWallet !== challenge.walletAddress) {
    return { ok: false, error: "Wallet does not match the signed challenge." };
  }

  if (!isHex(publicKey, 64) || !isHex(signature, 128)) {
    return { ok: false, error: "Public key or signature has an invalid format." };
  }

  try {
    const parsedPublicKey = PublicKey.fromHex(publicKey);
    const derivedAddress = parsedPublicKey.toAddress().toUserFriendlyAddress();

    if (derivedAddress !== normalizedWallet) {
      return { ok: false, error: "Public key does not belong to this wallet." };
    }

    const parsedSignature = Signature.fromHex(signature);
    const signedMessageHash = Hash.computeSha256(
      encodeNimiqSignedMessage(challenge.message)
    );
    const valid = parsedPublicKey.verify(parsedSignature, signedMessageHash);

    if (!valid) {
      return { ok: false, error: "Wallet signature is invalid." };
    }

    return {
      ok: true,
      walletAddress: normalizedWallet,
      publicKey: parsedPublicKey.toHex()
    };
  } catch {
    return { ok: false, error: "Wallet proof could not be verified." };
  }
}

function isHex(value, length) {
  return typeof value === "string" &&
    value.length === length &&
    /^[a-fA-F0-9]+$/.test(value);
}

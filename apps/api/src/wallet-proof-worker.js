import { blake2b } from "@noble/hashes/blake2.js";
import { encodeNimiqSignedMessage } from "./nimiq-signed-message.js";
import { normalizeWalletAddress } from "./validation.js";

const NIMIQ_ALPHABET = "0123456789ABCDEFGHJKLMNPQRSTUVXY";

export async function verifyWalletProofWorker({
  challenge,
  walletAddress,
  publicKey,
  signature
}) {
  const normalizedWallet = normalizeWalletAddress(walletAddress);

  if (!normalizedWallet || normalizedWallet !== challenge.walletAddress) {
    return { ok: false, error: "Wallet does not match the signed challenge." };
  }

  if (!isHex(publicKey, 64) || !isHex(signature, 128)) {
    return { ok: false, error: "Public key or signature has an invalid format." };
  }

  try {
    const publicKeyBytes = fromHex(publicKey);
    const derivedAddress = publicKeyToNimiqAddress(publicKeyBytes);

    if (derivedAddress !== normalizedWallet) {
      return { ok: false, error: "Public key does not belong to this wallet." };
    }

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      publicKeyBytes,
      { name: "Ed25519" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "Ed25519",
      cryptoKey,
      fromHex(signature),
      await crypto.subtle.digest(
        "SHA-256",
        encodeNimiqSignedMessage(challenge.message)
      )
    );

    if (!valid) {
      return { ok: false, error: "Wallet signature is invalid." };
    }

    return {
      ok: true,
      walletAddress: normalizedWallet,
      publicKey: publicKey.toLowerCase()
    };
  } catch {
    return { ok: false, error: "Wallet proof could not be verified." };
  }
}

export function publicKeyToNimiqAddress(publicKeyBytes) {
  if (!(publicKeyBytes instanceof Uint8Array) || publicKeyBytes.length !== 32) {
    throw new TypeError("Nimiq public keys must contain 32 bytes.");
  }

  const addressBytes = blake2b(publicKeyBytes, { dkLen: 32 }).slice(0, 20);
  const base32 = encodeNimiqBase32(addressBytes);
  const checksum = 98 - ibanChecksum(`NQ00${base32}`);
  const compact = `NQ${String(checksum).padStart(2, "0")}${base32}`;

  return compact.match(/.{1,4}/g).join(" ");
}

function encodeNimiqBase32(bytes) {
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      output += NIMIQ_ALPHABET[(value >>> bits) & 31];
      value &= (1 << bits) - 1;
    }
  }

  if (bits > 0) {
    output += NIMIQ_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function ibanChecksum(iban) {
  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
  let checksum = 0;

  for (const character of rearranged) {
    const numeric = /[0-9]/.test(character)
      ? character
      : String(character.charCodeAt(0) - 55);

    for (const digit of numeric) {
      checksum = (checksum * 10 + Number(digit)) % 97;
    }
  }

  return checksum;
}

function fromHex(value) {
  return Uint8Array.from(
    value.match(/.{2}/g),
    (byte) => Number.parseInt(byte, 16)
  );
}

function isHex(value, length) {
  return typeof value === "string" &&
    value.length === length &&
    /^[a-fA-F0-9]+$/.test(value);
}

const NIMIQ_ADDRESS_PATTERN = /^NQ[0-9]{2}(?:\s?[A-Z0-9]{4}){8}$/;

export function normalizeWalletAddress(walletAddress) {
  if (typeof walletAddress !== "string") {
    return null;
  }

  const trimmed = walletAddress.trim();
  const normalizedNimiq = trimmed.replace(/\s+/g, " ").toUpperCase();

  if (NIMIQ_ADDRESS_PATTERN.test(normalizedNimiq)) {
    return normalizedNimiq;
  }

  return null;
}

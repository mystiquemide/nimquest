const NIMIQ_ADDRESS_PATTERN = /^NQ[0-9]{2}(?:\s?[A-Z0-9]{4}){8}$/;
const EVM_ADDRESS_PATTERN = /^0x[a-fA-F0-9]{40}$/;
const DEVICE_ID_PATTERN = /^[a-fA-F0-9]{64}$/;

export function normalizeWalletAddress(walletAddress) {
  if (typeof walletAddress !== "string") {
    return null;
  }

  const trimmed = walletAddress.trim();
  const normalizedNimiq = trimmed.replace(/\s+/g, " ").toUpperCase();

  if (NIMIQ_ADDRESS_PATTERN.test(normalizedNimiq)) {
    return normalizedNimiq;
  }

  if (EVM_ADDRESS_PATTERN.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function normalizeDeviceId(deviceId) {
  if (deviceId === undefined || deviceId === null || deviceId === "") {
    return "unknown-device";
  }

  if (typeof deviceId !== "string") {
    return null;
  }

  const trimmed = deviceId.trim();

  if (!DEVICE_ID_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed.toLowerCase();
}

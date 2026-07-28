const encoder = new TextEncoder();
const SIGNED_MESSAGE_PREFIX = "\x16Nimiq Signed Message:\n";

export function encodeNimiqSignedMessage(message) {
  const messageBytes = encoder.encode(message);
  const prefixBytes = encoder.encode(
    `${SIGNED_MESSAGE_PREFIX}${messageBytes.byteLength}`
  );
  const payload = new Uint8Array(prefixBytes.byteLength + messageBytes.byteLength);

  payload.set(prefixBytes);
  payload.set(messageBytes, prefixBytes.byteLength);

  return payload;
}

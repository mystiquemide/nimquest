import { Hash } from "@nimiq/core";
import { encodeNimiqSignedMessage } from "../src/nimiq-signed-message.js";

export function signNimiqMessage(keyPair, message) {
  const hash = Hash.computeSha256(encodeNimiqSignedMessage(message));
  return keyPair.sign(hash).toHex();
}

import { base64ToBytes, bytesToBase64, bytesToUtf8, utf8ToBytes } from "./bytes";

// urlSafe: "-" and "_" instead of "+" and "/", and no "=" padding (what JWTs use)
export function encodeBase64(text: string, urlSafe = false): string {
  const b64 = bytesToBase64(utf8ToBytes(text));
  return urlSafe ? b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : b64;
}

// Throws "NOT VALID BASE64" or "NOT TEXT" (the bytes were not UTF-8, e.g. a file)
export function decodeBase64(b64: string): string {
  const bytes = base64ToBytes(b64);
  try {
    return bytesToUtf8(bytes);
  } catch {
    throw new Error("DECODED BYTES ARE NOT TEXT");
  }
}

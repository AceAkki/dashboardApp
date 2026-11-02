// Byte helpers shared by Base64 and the cipher.
// Written by hand so nothing depends on TextEncoder / atob being present in the JS engine.

// text -> UTF-8 bytes (emoji and accents become several bytes)
export function utf8ToBytes(text: string): Uint8Array {
  // encodeURIComponent gives %XX per UTF-8 byte, unescape turns each %XX into one char
  const bin = unescape(encodeURIComponent(text));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// UTF-8 bytes -> text. Throws when the bytes are not valid UTF-8.
export function bytesToUtf8(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return decodeURIComponent(escape(bin));
}

export function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// 3 bytes (24 bits) -> 4 characters of 6 bits each
export function bytesToBase64(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0);
    out += ALPHABET[(n >> 18) & 63] + ALPHABET[(n >> 12) & 63];
    out += i + 1 < bytes.length ? ALPHABET[(n >> 6) & 63] : "=";
    out += i + 2 < bytes.length ? ALPHABET[n & 63] : "=";
  }
  return out;
}

// Accepts normal and URL-safe Base64, with or without "=" padding.
export function base64ToBytes(input: string): Uint8Array {
  const clean = input
    .replace(/\s/g, "")
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .replace(/=+$/, "");
  if (!/^[A-Za-z0-9+/]*$/.test(clean) || clean.length % 4 === 1) {
    throw new Error("NOT VALID BASE64");
  }
  const out = new Uint8Array(Math.floor((clean.length * 3) / 4));
  let o = 0;
  for (let i = 0; i < clean.length; i += 4) {
    const a = ALPHABET.indexOf(clean[i]);
    const b = ALPHABET.indexOf(clean[i + 1]);
    const c = i + 2 < clean.length ? ALPHABET.indexOf(clean[i + 2]) : 0;
    const d = i + 3 < clean.length ? ALPHABET.indexOf(clean[i + 3]) : 0;
    const n = (a << 18) | (b << 12) | (c << 6) | d;
    if (o < out.length) out[o++] = (n >> 16) & 255;
    if (o < out.length) out[o++] = (n >> 8) & 255;
    if (o < out.length) out[o++] = n & 255;
  }
  return out;
}

import { getRandomBytes } from "expo-crypto";
import { bytesToBase64, bytesToHex } from "./bytes";

// Math.random() is predictable, so everything here uses the phone's secure random source.

export const CHARSETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?",
} as const;

export type CharsetKey = keyof typeof CHARSETS;

// Random number from 0 to max-1. A plain `number % max` favours small numbers,
// so draws from the unfair leftover range are thrown away and a new one is drawn.
const RANGE = 2 ** 32;
function randomIndex(max: number): number {
  const limit = RANGE - (RANGE % max);
  for (;;) {
    const b = getRandomBytes(4);
    const n = ((b[0] << 24) | (b[1] << 16) | (b[2] << 8) | b[3]) >>> 0;
    if (n < limit) return n % max;
  }
}

const pick = (chars: string) => chars[randomIndex(chars.length)];

export function generatePassword(length: number, sets: CharsetKey[]): string {
  if (sets.length === 0) return "";
  const pool = sets.map((s) => CHARSETS[s]).join("");

  // one character from every chosen set first, so each is guaranteed to appear
  const chars = sets.map((s) => pick(CHARSETS[s]));
  while (chars.length < length) chars.push(pick(pool));

  // shuffle (Fisher-Yates) so the guaranteed ones are not always at the front
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, Math.max(length, sets.length)).join("");
}

// how hard it is to guess: length * log2(number of possible characters)
export function entropyBits(length: number, sets: CharsetKey[]): number {
  const poolSize = sets.reduce((n, s) => n + CHARSETS[s].length, 0);
  return poolSize ? Math.round(length * Math.log2(poolSize)) : 0;
}

export type TokenFormat = "hex" | "base64url";

export function generateToken(byteCount: number, format: TokenFormat): string {
  const bytes = getRandomBytes(byteCount);
  if (format === "hex") return bytesToHex(bytes);
  return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

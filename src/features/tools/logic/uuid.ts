import { getRandomBytes, randomUUID } from "expo-crypto";
import { bytesToHex } from "./bytes";

export type UuidVersion = "v4" | "v7";

// v4: fully random
// v7: starts with the current time in milliseconds, so newer ids sort after older ones
//     (good for database keys). The rest is random.
function uuidV7(): string {
  const b = getRandomBytes(16);
  const ms = Date.now(); // 48 bits, too big for << so divide instead
  b[0] = (ms / 2 ** 40) & 255;
  b[1] = (ms / 2 ** 32) & 255;
  b[2] = (ms / 2 ** 24) & 255;
  b[3] = (ms / 2 ** 16) & 255;
  b[4] = (ms / 2 ** 8) & 255;
  b[5] = ms & 255;
  b[6] = (b[6] & 0x0f) | 0x70; // version 7
  b[8] = (b[8] & 0x3f) | 0x80; // variant
  const h = bytesToHex(b);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function makeUuids(version: UuidVersion, count: number): string[] {
  return Array.from({ length: count }, () => (version === "v4" ? randomUUID() : uuidV7()));
}

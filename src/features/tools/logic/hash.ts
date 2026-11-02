import { md5, sha1 } from "@noble/hashes/legacy";
import { sha256, sha512 } from "@noble/hashes/sha2";

import { bytesToHex, utf8ToBytes } from "./bytes";

// Hashed in plain JavaScript so it behaves the same on Android, iOS and web.
// (expo-crypto's digest does not support MD5 on web, which is why it is not used here.)
const ALGORITHMS = [
  { label: "MD5", hash: md5 },
  { label: "SHA-1", hash: sha1 },
  { label: "SHA-256", hash: sha256 },
  { label: "SHA-512", hash: sha512 },
];

export type HashRow = { label: string; hex: string };

// Hashes the text with every algorithm. Output is lowercase hex.
// (MD5 and SHA-1 are broken for security: fine for checksums, not for passwords.)
// Stays async so the panel does not have to change.
export async function hashAll(text: string): Promise<HashRow[]> {
  const bytes = utf8ToBytes(text);
  return ALGORITHMS.map(({ label, hash }) => ({
    label,
    hex: bytesToHex(hash(bytes)),
  }));
}

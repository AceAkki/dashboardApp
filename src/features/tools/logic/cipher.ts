import { getRandomBytes } from "expo-crypto";
import { gcm } from "@noble/ciphers/aes";
import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";

import { base64ToBytes, bytesToBase64, bytesToUtf8, utf8ToBytes } from "./bytes";

/* AES-256-GCM: encrypts AND detects a wrong passphrase or edited text.

 A passphrase is not a valid AES key (a key must be exactly 32 random-looking bytes),
 so PBKDF2 stretches it: it hashes the passphrase + a random salt many times ("rounds").
 More rounds = slower for an attacker guessing passphrases, but also slower on the phone.

 OWASP recommends 600,000 rounds for PBKDF2-SHA256. This is pure JavaScript (no native
 code, to keep the app small), so a phone may be far too slow for that. Instead of a fixed
 number, each phone times itself and picks as many rounds as fit in about TARGET_MS,
 between MIN_ROUNDS and MAX_ROUNDS. The number used is stored inside the encrypted text,
 so any phone can decrypt it later, whatever speed it has. */
const MIN_ROUNDS = 50_000;
const MAX_ROUNDS = 600_000;
const TARGET_MS = 1500;
const PROBE_ROUNDS = 10_000;
// Decrypting reads the round count from the text. Refuse silly values so a crafted
// text can't freeze the phone.
const ACCEPT_MAX_ROUNDS = 2_000_000;
const V1_ROUNDS = 50_000; // the first format had no round count: it was always this

const VERSION = 2;
const SALT_LENGTH = 16;
const NONCE_LENGTH = 12; // the size GCM wants
const TAG_LENGTH = 16;
const HEADER_V1 = 1 + SALT_LENGTH + NONCE_LENGTH;
const HEADER = 1 + 4 + SALT_LENGTH + NONCE_LENGTH;

const deriveKey = (passphrase: string, salt: Uint8Array, rounds: number) =>
  pbkdf2Async(sha256, utf8ToBytes(passphrase), salt, { c: rounds, dkLen: 32 });

// time a small run, then scale it up to fit TARGET_MS
async function chooseRounds(): Promise<number> {
  const start = Date.now();
  await pbkdf2Async(sha256, new Uint8Array(1), new Uint8Array(SALT_LENGTH), {
    c: PROBE_ROUNDS,
    dkLen: 32,
  });
  const ms = Math.max(Date.now() - start, 1);
  const fit = Math.round(((PROBE_ROUNDS * TARGET_MS) / ms) / 10_000) * 10_000;
  return Math.min(MAX_ROUNDS, Math.max(MIN_ROUNDS, fit));
}

// result = Base64( version 2 | rounds (4 bytes) | salt | nonce | encrypted data + 16 byte check tag )
// A new salt and nonce every time, so the same text never encrypts the same way twice.
// `rounds` is only for tests; normally leave it out.
export async function encryptText(
  plain: string,
  passphrase: string,
  rounds?: number,
): Promise<string> {
  const used = rounds ?? (await chooseRounds());
  const salt = getRandomBytes(SALT_LENGTH);
  const nonce = getRandomBytes(NONCE_LENGTH);
  const key = await deriveKey(passphrase, salt, used);
  const sealed = gcm(key, nonce).encrypt(utf8ToBytes(plain));

  const out = new Uint8Array(HEADER + sealed.length);
  out[0] = VERSION;
  new DataView(out.buffer).setUint32(1, used);
  out.set(salt, 5);
  out.set(nonce, 5 + SALT_LENGTH);
  out.set(sealed, HEADER);
  return bytesToBase64(out);
}

export async function decryptText(packed: string, passphrase: string): Promise<string> {
  let data: Uint8Array;
  try {
    data = base64ToBytes(packed);
  } catch {
    throw new Error("THIS IS NOT ENCRYPTED TEXT");
  }

  let rounds: number;
  let salt: Uint8Array;
  let nonce: Uint8Array;
  let sealed: Uint8Array;
  if (data[0] === 2 && data.length >= HEADER + TAG_LENGTH) {
    rounds = new DataView(data.buffer, data.byteOffset).getUint32(1);
    salt = data.slice(5, 5 + SALT_LENGTH);
    nonce = data.slice(5 + SALT_LENGTH, HEADER);
    sealed = data.slice(HEADER);
  } else if (data[0] === 1 && data.length >= HEADER_V1 + TAG_LENGTH) {
    // text made by the first version of this tool
    rounds = V1_ROUNDS;
    salt = data.slice(1, 1 + SALT_LENGTH);
    nonce = data.slice(1 + SALT_LENGTH, HEADER_V1);
    sealed = data.slice(HEADER_V1);
  } else {
    throw new Error("NOT TEXT MADE BY THIS TOOL");
  }
  if (rounds < 1 || rounds > ACCEPT_MAX_ROUNDS) throw new Error("NOT TEXT MADE BY THIS TOOL");

  const key = await deriveKey(passphrase, salt, rounds);
  try {
    return bytesToUtf8(gcm(key, nonce).decrypt(sealed));
  } catch {
    // GCM's check tag fails for a wrong passphrase and for edited text alike
    throw new Error("WRONG PASSPHRASE OR DAMAGED TEXT");
  }
}

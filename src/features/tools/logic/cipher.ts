import { getRandomBytes } from "expo-crypto";
import { gcm } from "@noble/ciphers/aes";
import { pbkdf2Async } from "@noble/hashes/pbkdf2";
import { sha256 } from "@noble/hashes/sha256";

import { base64ToBytes, bytesToBase64, bytesToUtf8, utf8ToBytes } from "./bytes";

// AES-256-GCM: encrypts AND detects a wrong passphrase or edited text.
//
// A passphrase is not a valid AES key (a key must be exactly 32 random-looking bytes),
// so PBKDF2 stretches it: it hashes the passphrase + a random salt ITERATIONS times.
// More rounds = slower for an attacker guessing passphrases, but also slower on the phone.
const ITERATIONS = 50_000;

const VERSION = 1; // lets a future version of this format be recognised
const SALT_LENGTH = 16;
const NONCE_LENGTH = 12; // the size GCM wants
const HEADER = 1 + SALT_LENGTH + NONCE_LENGTH;

const deriveKey = (passphrase: string, salt: Uint8Array) =>
  pbkdf2Async(sha256, utf8ToBytes(passphrase), salt, { c: ITERATIONS, dkLen: 32 });

// result = Base64( version | salt | nonce | encrypted data + 16 byte check tag )
// A new salt and nonce every time, so the same text never encrypts the same way twice.
export async function encryptText(plain: string, passphrase: string): Promise<string> {
  const salt = getRandomBytes(SALT_LENGTH);
  const nonce = getRandomBytes(NONCE_LENGTH);
  const key = await deriveKey(passphrase, salt);
  const sealed = gcm(key, nonce).encrypt(utf8ToBytes(plain));

  const out = new Uint8Array(HEADER + sealed.length);
  out[0] = VERSION;
  out.set(salt, 1);
  out.set(nonce, 1 + SALT_LENGTH);
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
  if (data.length < HEADER + 16 || data[0] !== VERSION) {
    throw new Error("NOT TEXT MADE BY THIS TOOL");
  }

  const key = await deriveKey(passphrase, data.slice(1, 1 + SALT_LENGTH));
  try {
    const plain = gcm(key, data.slice(1 + SALT_LENGTH, HEADER)).decrypt(data.slice(HEADER));
    return bytesToUtf8(plain);
  } catch {
    // GCM's check tag fails for a wrong passphrase and for edited text alike
    throw new Error("WRONG PASSPHRASE OR DAMAGED TEXT");
  }
}

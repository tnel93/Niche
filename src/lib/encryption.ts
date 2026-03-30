/**
 * AES-256-GCM for PII at rest (SPEC — store ciphertext in DB; key in ENCRYPTION_KEY).
 * Format: iv_hex:authTag_hex:ciphertext_hex (all hex except UTF-8 plaintext in/out).
 */

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("ENCRYPTION_KEY is not set");
  }
  const buf = Buffer.from(raw, "hex");
  if (buf.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 64 hex chars (32 bytes) for AES-256");
  }
  return buf;
}

/** Encrypt UTF-8 string → colon-separated hex blob for TEXT columns, or use Buffer for BYTEA. */
export function encrypt(plainText: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decrypt(payload: string): string {
  const key = getKey();
  const parts = payload.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload format");
  }
  const [ivHex, authTagHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/** Encrypt to Buffer for BYTEA columns (stores raw iv|tag|ciphertext bytes). */
export function encryptToBuffer(plainText: string): Buffer {
  const s = encrypt(plainText);
  return Buffer.from(s, "utf8");
}

export function decryptFromBuffer(data: Buffer): string {
  return decrypt(data.toString("utf8"));
}

/**
 * Pure ES2022 SHA-256, HMAC-SHA256, and constant-time comparison utilities.
 *
 * Designed specifically for Web-standard V8 Edge isolates (including ArvanCloud Edge)
 * without requiring Node's `node:crypto` or assuming `crypto.subtle` availability.
 */

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8');

// SHA-256 round constants (first 32 bits of fractional parts of cube roots of first 64 primes)
const K256 = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

function rotr(value: number, bits: number): number {
  return (value >>> bits) | (value << (32 - bits));
}

export function sha256Bytes(message: Uint8Array): Uint8Array<ArrayBuffer> {
  const len = message.length;
  const bitLenHi = Math.floor((len * 8) / 0x100000000);
  const bitLenLo = (len * 8) >>> 0;

  // Pad to multiple of 64 bytes with 0x80 + zeros + 64-bit big-endian length
  const paddedLen = Math.ceil((len + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(message, 0);
  padded[len] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 8, bitLenHi, false);
  view.setUint32(paddedLen - 4, bitLenLo, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K256[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const out = new Uint8Array(32);
  const outView = new DataView(out.buffer);
  outView.setUint32(0, h0, false);
  outView.setUint32(4, h1, false);
  outView.setUint32(8, h2, false);
  outView.setUint32(12, h3, false);
  outView.setUint32(16, h4, false);
  outView.setUint32(20, h5, false);
  outView.setUint32(24, h6, false);
  outView.setUint32(28, h7, false);
  return out;
}

export function sha256Hex(input: string): string {
  const bytes = sha256Bytes(textEncoder.encode(input));
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export function hmacSha256Bytes(secret: string, message: string): Uint8Array<ArrayBuffer> {
  const blockSize = 64;
  let keyBytes: Uint8Array = textEncoder.encode(secret);
  if (keyBytes.length > blockSize) {
    keyBytes = sha256Bytes(keyBytes);
  }

  const paddedKey = new Uint8Array(blockSize);
  paddedKey.set(keyBytes, 0);

  const oKeyPad = new Uint8Array(blockSize);
  const iKeyPad = new Uint8Array(blockSize);
  for (let i = 0; i < blockSize; i++) {
    oKeyPad[i] = paddedKey[i] ^ 0x5c;
    iKeyPad[i] = paddedKey[i] ^ 0x36;
  }

  const msgBytes = textEncoder.encode(message);
  const inner = new Uint8Array(blockSize + msgBytes.length);
  inner.set(iKeyPad, 0);
  inner.set(msgBytes, blockSize);
  const innerHash = sha256Bytes(inner);

  const outer = new Uint8Array(blockSize + innerHash.length);
  outer.set(oKeyPad, 0);
  outer.set(innerHash, blockSize);
  return sha256Bytes(outer);
}

export function hmacSha256Hex(secret: string, message: string): string {
  const bytes = hmacSha256Bytes(secret, message);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;

    out += BASE64_CHARS[b0 >> 2];
    out += BASE64_CHARS[((b0 & 0x03) << 4) | (b1 >> 4)];
    if (i + 1 < bytes.length) {
      out += BASE64_CHARS[((b1 & 0x0f) << 2) | (b2 >> 6)];
    }
    if (i + 2 < bytes.length) {
      out += BASE64_CHARS[b2 & 0x3f];
    }
  }
  return out.replace(/\+/g, '-').replace(/\//g, '_');
}

export function base64UrlEncodeString(input: string): string {
  return base64UrlEncodeBytes(textEncoder.encode(input));
}

export function base64UrlDecodeToString(input: string): string | null {
  if (!/^[A-Za-z0-9_-]+$/.test(input)) return null;
  const standard = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (standard.length % 4)) % 4;
  const padded = standard + '='.repeat(padLen);

  const bytes: number[] = [];
  for (let i = 0; i < padded.length; i += 4) {
    const c0 = BASE64_CHARS.indexOf(padded[i]);
    const c1 = BASE64_CHARS.indexOf(padded[i + 1]);
    const c2 = padded[i + 2] === '=' ? -1 : BASE64_CHARS.indexOf(padded[i + 2]);
    const c3 = padded[i + 3] === '=' ? -1 : BASE64_CHARS.indexOf(padded[i + 3]);
    if (c0 < 0 || c1 < 0 || (padded[i + 2] !== '=' && c2 < 0) || (padded[i + 3] !== '=' && c3 < 0)) {
      return null;
    }

    bytes.push((c0 << 2) | (c1 >> 4));
    if (c2 >= 0) {
      bytes.push(((c1 & 0x0f) << 4) | (c2 >> 2));
    }
    if (c3 >= 0) {
      bytes.push(((c2 & 0x03) << 6) | c3);
    }
  }

  try {
    return textDecoder.decode(new Uint8Array(bytes));
  } catch {
    return null;
  }
}

export interface AttemptTokenClaims {
  v: 1;
  nonceId: string;
  challengeType: 'campaign' | 'daily' | 'friend';
  challengeId: string;
  playerIdHash: string;
  issuedAtMs: number;
  expiresAtMs: number;
  minSolveMs: number;
}

export function createRandomHexId(byteLength = 12): string {
  const bytes = new Uint8Array(byteLength);
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.getRandomValues === 'function') {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    const seed = `${Date.now()}:${Math.random()}:${Math.random()}`;
    const digest = sha256Bytes(textEncoder.encode(seed));
    bytes.set(digest.subarray(0, Math.min(byteLength, digest.length)));
  }
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

export function signAttemptToken(claims: AttemptTokenClaims, secret: string): string {
  const payloadB64 = base64UrlEncodeString(JSON.stringify(claims));
  const sigBytes = hmacSha256Bytes(secret, `qanatchi:attempt:v1:${payloadB64}`);
  const sigB64 = base64UrlEncodeBytes(sigBytes);
  return `${payloadB64}.${sigB64}`;
}

export type VerifyAttemptTokenResult =
  | { ok: true; claims: AttemptTokenClaims }
  | { ok: false; reason: 'malformed' | 'invalid_signature' | 'expired' };

export function verifyAttemptToken(
  token: string,
  secret: string,
  nowMs: number,
): VerifyAttemptTokenResult {
  const trimmed = token.trim();
  const dotIdx = trimmed.indexOf('.');
  if (dotIdx <= 0 || dotIdx === trimmed.length - 1 || trimmed.indexOf('.', dotIdx + 1) !== -1) {
    return { ok: false, reason: 'malformed' };
  }

  const payloadB64 = trimmed.slice(0, dotIdx);
  const providedSig = trimmed.slice(dotIdx + 1);
  const expectedSig = base64UrlEncodeBytes(
    hmacSha256Bytes(secret, `qanatchi:attempt:v1:${payloadB64}`),
  );

  if (!constantTimeEqual(providedSig, expectedSig)) {
    return { ok: false, reason: 'invalid_signature' };
  }

  const decoded = base64UrlDecodeToString(payloadB64);
  if (!decoded) {
    return { ok: false, reason: 'malformed' };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded);
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, reason: 'malformed' };
  }

  const obj = parsed as Partial<AttemptTokenClaims>;
  if (
    obj.v !== 1 ||
    typeof obj.nonceId !== 'string' ||
    !/^[a-zA-Z0-9_-]{8,64}$/.test(obj.nonceId) ||
    (obj.challengeType !== 'campaign' &&
      obj.challengeType !== 'daily' &&
      obj.challengeType !== 'friend') ||
    typeof obj.challengeId !== 'string' ||
    typeof obj.playerIdHash !== 'string' ||
    typeof obj.issuedAtMs !== 'number' ||
    typeof obj.expiresAtMs !== 'number' ||
    typeof obj.minSolveMs !== 'number'
  ) {
    return { ok: false, reason: 'malformed' };
  }

  if (nowMs > obj.expiresAtMs) {
    return { ok: false, reason: 'expired' };
  }

  return {
    ok: true,
    claims: {
      v: 1,
      nonceId: obj.nonceId,
      challengeType: obj.challengeType,
      challengeId: obj.challengeId,
      playerIdHash: obj.playerIdHash,
      issuedAtMs: obj.issuedAtMs,
      expiresAtMs: obj.expiresAtMs,
      minSolveMs: obj.minSolveMs,
    },
  };
}

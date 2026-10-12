const encoder = new TextEncoder();

const HASHES = { sha1: 'SHA-1', sha256: 'SHA-256', sha512: 'SHA-512' } as const;
export type Algorithm = keyof typeof HASHES;
export type Encoding = 'hex' | 'base64';

/** Joins text and raw bytes into one buffer, e.g. a timestamp prefix and the raw body. */
export function concatBytes(...parts: (string | Uint8Array)[]): Uint8Array {
  const chunks = parts.map((p) =>
    typeof p === 'string' ? encoder.encode(p) : p
  );
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

/**
 * HMAC via Web Crypto, so it runs on Node, Deno, Bun and edge runtimes.
 * Pass raw bytes to sign the body exactly as received.
 */
export async function digest(
  secret: string,
  message: string | Uint8Array,
  algorithm: Algorithm = 'sha256',
  encoding: Encoding = 'hex'
): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: HASHES[algorithm] },
    false,
    ['sign']
  );
  const bytes = new Uint8Array(
    await crypto.subtle.sign(
      'HMAC',
      key,
      // Copy into a plain ArrayBuffer: Web Crypto rejects views over SharedArrayBuffer.
      typeof message === 'string'
        ? encoder.encode(message)
        : new Uint8Array(message)
    )
  );
  if (encoding === 'hex')
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

/** Constant-time comparison (Web Crypto has no timingSafeEqual). */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Replay protection: is a unix-seconds timestamp within `toleranceSeconds` of now? */
export function isFresh(
  timestamp: string | number | null,
  toleranceSeconds: number,
  now = Date.now()
): boolean {
  const ts = Number(timestamp);
  return Number.isFinite(ts) && Math.abs(now / 1000 - ts) <= toleranceSeconds;
}

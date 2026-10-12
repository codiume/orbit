import { digest, safeEqual, type Algorithm, type Encoding } from './crypto';
import type { SignatureValidator } from './types';

export interface HmacOptions {
  algorithm?: Algorithm; // default "sha256"
  encoding?: Encoding; // default "hex"
  /** Text the provider puts before the digest, e.g. "sha256=" */
  prefix?: string;
}

/** Declarative validator: header value === prefix + HMAC(rawBytes). Covers most providers. */
export function hmac({
  algorithm = 'sha256',
  encoding = 'hex',
  prefix = ''
}: HmacOptions = {}): SignatureValidator {
  return async ({ request, rawBytes, secret, headerName }) => {
    const header = request.headers.get(headerName);
    if (!header) return false;
    return safeEqual(
      prefix + (await digest(secret, rawBytes, algorithm, encoding)),
      header.trim()
    );
  };
}

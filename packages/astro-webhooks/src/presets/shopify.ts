import { hmac } from '../hmac';
import type { Secret, SignatureOptions } from '../types';

export function shopify({
  signingSecret
}: {
  signingSecret: Secret;
}): SignatureOptions {
  return {
    signingSecret,
    signatureHeaderName: 'X-Shopify-Hmac-Sha256',
    signatureValidator: hmac({ algorithm: 'sha256', encoding: 'base64' })
  };
}

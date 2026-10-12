import { hmac } from '../hmac';
import type { Secret, SignatureOptions } from '../types';

export function github({
  signingSecret
}: {
  signingSecret: Secret;
}): SignatureOptions {
  return {
    signingSecret,
    signatureHeaderName: 'X-Hub-Signature-256',
    signatureValidator: hmac({
      algorithm: 'sha256',
      encoding: 'hex',
      prefix: 'sha256='
    })
  };
}

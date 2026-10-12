import { concatBytes, digest, isFresh, safeEqual } from '../crypto';
import type { Secret, SignatureOptions } from '../types';

export function stripe({
  signingSecret,
  tolerance = 300
}: {
  signingSecret: Secret;
  /** Max request age in seconds (replay protection). Default 300. */
  tolerance?: number;
}): SignatureOptions {
  return {
    signingSecret,
    signatureHeaderName: 'Stripe-Signature',
    signatureValidator: async ({ request, rawBytes, secret, headerName }) => {
      const header = request.headers.get(headerName);
      if (!header) return false;

      // Header looks like: t=1700000000,v1=abc...,v1=def...
      const parts = header.split(',').map((p) => p.trim().split('='));
      const timestamp = parts.find(([k]) => k === 't')?.[1];
      const candidates = parts.filter(([k]) => k === 'v1').map(([, v]) => v);
      if (!timestamp || !candidates.length || !isFresh(timestamp, tolerance))
        return false;

      const expected = await digest(
        secret,
        concatBytes(`${timestamp}.`, rawBytes)
      );
      return candidates.some((c) => safeEqual(expected, c));
    }
  };
}

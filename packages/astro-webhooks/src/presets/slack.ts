import { concatBytes, digest, isFresh, safeEqual } from '../crypto';
import type { Secret, SignatureOptions } from '../types';

export function slack({
  signingSecret,
  tolerance = 300
}: {
  signingSecret: Secret;
  /** Max request age in seconds (replay protection). Default 300. */
  tolerance?: number;
}): SignatureOptions {
  return {
    signingSecret,
    signatureHeaderName: 'X-Slack-Signature',
    signatureValidator: async ({ request, rawBytes, secret, headerName }) => {
      const signature = request.headers.get(headerName);
      const timestamp = request.headers.get('X-Slack-Request-Timestamp');
      if (!signature || !timestamp || !isFresh(timestamp, tolerance))
        return false;
      const expected =
        'v0=' +
        (await digest(secret, concatBytes(`v0:${timestamp}:`, rawBytes)));
      return safeEqual(expected, signature);
    }
  };
}

import type { APIContext } from 'astro';
import { hmac } from './hmac';
import type { Secret, SignatureOptions } from './types';

export class WebhookConfigError extends Error {}

async function resolveSecrets(
  secret: Secret,
  context?: APIContext
): Promise<string[]> {
  let value: string | string[] | undefined;
  try {
    value =
      typeof secret === 'function'
        ? await secret(context as APIContext)
        : secret;
  } catch (cause) {
    // e.g. `(ctx) => ctx.locals...` called without a context, outside an endpoint.
    throw new WebhookConfigError('failed to resolve signing secret', { cause });
  }
  const list = (Array.isArray(value) ? value : [value]).filter(
    (s): s is string => typeof s === 'string' && s.length > 0
  );
  // Fail closed: a missing secret must never mean "accept everything".
  if (!list.length)
    throw new WebhookConfigError('signing secret is missing or empty');
  return list;
}

/**
 * Framework-agnostic primitive: works on any Request, so it can be used in
 * Astro middleware or outside Astro. Reads a clone, so the body stays consumable.
 */
export async function verifySignature(
  request: Request,
  options: SignatureOptions,
  context?: APIContext
): Promise<{ valid: boolean; rawBody: string }> {
  const secrets = await resolveSecrets(options.signingSecret, context);
  const rawBytes = new Uint8Array(await request.clone().arrayBuffer());
  const rawBody = new TextDecoder().decode(rawBytes);
  const headerName = options.signatureHeaderName ?? 'Signature';
  const validate = options.signatureValidator ?? hmac();

  for (const secret of secrets) {
    try {
      if (await validate({ request, rawBytes, rawBody, secret, headerName }))
        return { valid: true, rawBody };
    } catch (err) {
      console.warn(
        '[astro-webhooks] signature validator threw, treating as invalid',
        err
      );
    }
  }
  return { valid: false, rawBody };
}

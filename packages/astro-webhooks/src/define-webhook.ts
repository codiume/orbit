import type { APIRoute } from 'astro';
import type { WebhookProfile } from './types';
import { verifySignature } from './verify';

function parseBody(rawBody: string, contentType: string | null): unknown {
  if (rawBody.trim() === '') return undefined;
  if (contentType?.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }
  return JSON.parse(rawBody);
}

export function defineWebhook<T = unknown>(
  profile: WebhookProfile<T>
): APIRoute {
  const label = `[astro-webhooks]${profile.name ? ` ${profile.name}:` : ''}`;

  return async (context) => {
    const { request } = context;

    let verified: { valid: boolean; rawBody: string };
    try {
      verified = await verifySignature(request, profile, context);
    } catch (err) {
      console.error(label, err);
      return new Response('Webhook misconfigured', { status: 500 });
    }
    if (!verified.valid)
      return new Response('Invalid signature', { status: 401 });

    let payload: unknown;
    try {
      payload = parseBody(
        verified.rawBody,
        request.headers.get('content-type')
      );
      if (profile.schema) payload = profile.schema.parse(payload);
    } catch {
      return new Response('Invalid payload', { status: 400 });
    }

    try {
      const response = await profile.handle({
        payload: payload as T,
        rawBody: verified.rawBody,
        request,
        context,
        name: profile.name
      });
      return response ?? new Response('ok', { status: 200 });
    } catch (err) {
      console.error(label, 'handler failed', err);
      return new Response('Handler error', { status: 500 }); // sender will retry
    }
  };
}

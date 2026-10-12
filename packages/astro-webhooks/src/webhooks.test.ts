import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  concatBytes,
  defineWebhook,
  digest,
  github,
  hmac,
  isFresh,
  safeEqual,
  shopify,
  slack,
  stripe,
  verifySignature,
  WebhookConfigError
} from './index';

// Signatures are computed with node:crypto, independently of the library's Web Crypto code.
const sign = (
  alg: string,
  secret: string,
  data: string | Uint8Array,
  enc: 'hex' | 'base64' = 'hex'
) => createHmac(alg, secret).update(data).digest(enc);

const call = (
  route: any,
  body: string | Uint8Array,
  headers: Record<string, string> = {}
) =>
  route({
    request: new Request('http://localhost/hook', {
      method: 'POST',
      body: body as BodyInit,
      headers: { 'content-type': 'application/json', ...headers }
    })
  });

const body = JSON.stringify({ action: 'push' });
const now = () => String(Math.floor(Date.now() / 1000));
const handle = () => {};

describe('default validator (HMAC-SHA256 hex)', () => {
  const route = defineWebhook({ signingSecret: 's', handle });

  it('accepts a valid signature', async () => {
    expect(
      (await call(route, body, { Signature: sign('sha256', 's', body) })).status
    ).toBe(200);
  });
  it('rejects a wrong signature', async () => {
    expect((await call(route, body, { Signature: 'nope' })).status).toBe(401);
  });
  it('rejects a missing header', async () => {
    expect((await call(route, body)).status).toBe(401);
  });
  it('honours signatureHeaderName', async () => {
    const r = defineWebhook({
      signingSecret: 's',
      signatureHeaderName: 'X-Sig',
      handle
    });
    expect(
      (await call(r, body, { 'X-Sig': sign('sha256', 's', body) })).status
    ).toBe(200);
  });
});

describe('secrets', () => {
  it('accepts any secret in a rotation list', async () => {
    const r = defineWebhook({ signingSecret: ['new', 'old'], handle });
    expect(
      (await call(r, body, { Signature: sign('sha256', 'old', body) })).status
    ).toBe(200);
  });
  it('resolves a function secret per request', async () => {
    const r = defineWebhook({ signingSecret: () => 'lazy', handle });
    expect(
      (await call(r, body, { Signature: sign('sha256', 'lazy', body) })).status
    ).toBe(200);
  });
  it('fails closed when the secret is missing', async () => {
    const r = defineWebhook({ signingSecret: () => undefined, handle });
    expect(
      (await call(r, body, { Signature: sign('sha256', '', body) })).status
    ).toBe(500);
  });
});

describe('presets', () => {
  it('github', async () => {
    const r = defineWebhook({ ...github({ signingSecret: 'g' }), handle });
    const ok = { 'X-Hub-Signature-256': 'sha256=' + sign('sha256', 'g', body) };
    const bad = {
      'X-Hub-Signature-256': 'sha256=' + sign('sha256', 'x', body)
    };
    expect((await call(r, body, ok)).status).toBe(200);
    expect((await call(r, body, bad)).status).toBe(401);
  });

  it('shopify (base64)', async () => {
    const r = defineWebhook({ ...shopify({ signingSecret: 'sh' }), handle });
    expect(
      (
        await call(r, body, {
          'X-Shopify-Hmac-Sha256': sign('sha256', 'sh', body, 'base64')
        })
      ).status
    ).toBe(200);
  });

  it('slack, and rejects replays', async () => {
    const r = defineWebhook({ ...slack({ signingSecret: 'sl' }), handle });
    const at = (ts: string) => ({
      'X-Slack-Request-Timestamp': ts,
      'X-Slack-Signature': 'v0=' + sign('sha256', 'sl', `v0:${ts}:${body}`)
    });
    expect((await call(r, body, at(now()))).status).toBe(200);
    expect((await call(r, body, at(String(Number(now()) - 3600)))).status).toBe(
      401
    );
  });

  it('stripe (multiple v1 values), and rejects replays', async () => {
    const r = defineWebhook({ ...stripe({ signingSecret: 'st' }), handle });
    const at = (ts: string) => ({
      'Stripe-Signature': `t=${ts},v1=deadbeef,v1=${sign('sha256', 'st', `${ts}.${body}`)}`
    });
    expect((await call(r, body, at(now()))).status).toBe(200);
    expect((await call(r, body, at(String(Number(now()) - 3600)))).status).toBe(
      401
    );
  });
});

describe('payload and handler', () => {
  const headers = { Signature: sign('sha256', 's', body) };

  it('passes the parsed payload to handle', async () => {
    let seen: any;
    const r = defineWebhook({
      signingSecret: 's',
      handle: ({ payload }) => {
        seen = payload;
      }
    });
    await call(r, body, headers);
    expect(seen.action).toBe('push');
  });

  it('parses form-encoded bodies', async () => {
    const form = 'command=%2Fdeploy&text=prod';
    let seen: any;
    const r = defineWebhook({
      signingSecret: 's',
      handle: ({ payload }) => {
        seen = payload;
      }
    });
    await r({
      request: new Request('http://localhost/hook', {
        method: 'POST',
        body: form,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Signature: sign('sha256', 's', form)
        }
      })
    } as any);
    expect(seen.command).toBe('/deploy');
  });

  it('responds 400 when the schema rejects (after signature check)', async () => {
    const schema = {
      parse: (d: any) => {
        if (typeof d?.id !== 'number') throw new Error('bad');
        return d as { id: number };
      }
    };
    const r = defineWebhook({ signingSecret: 's', schema, handle: () => {} });
    expect((await call(r, body, headers)).status).toBe(400);
  });

  it('responds 500 when the handler throws', async () => {
    const r = defineWebhook({
      signingSecret: 's',
      handle: () => {
        throw new Error('x');
      }
    });
    expect((await call(r, body, headers)).status).toBe(500);
  });

  it('lets handle return a custom Response', async () => {
    const r = defineWebhook({
      signingSecret: 's',
      handle: () => new Response('accepted', { status: 202 })
    });
    expect((await call(r, body, headers)).status).toBe(202);
  });
});

describe('edge cases', () => {
  const headers = { Signature: sign('sha256', 's', body) };

  it('responds 400 on a signed but malformed JSON body', async () => {
    const bad = '{not json';
    const r = defineWebhook({ signingSecret: 's', handle });
    expect(
      (await call(r, bad, { Signature: sign('sha256', 's', bad) })).status
    ).toBe(400);
  });

  it('passes undefined for an empty body', async () => {
    let seen: any = 'unset';
    const r = defineWebhook({
      signingSecret: 's',
      handle: ({ payload }) => {
        seen = payload;
      }
    });
    expect(
      (await call(r, '', { Signature: sign('sha256', 's', '') })).status
    ).toBe(200);
    expect(seen).toBeUndefined();
  });

  it('checks the signature before the schema', async () => {
    let parsed = false;
    const schema = {
      parse: (d: unknown) => {
        parsed = true;
        return d;
      }
    };
    const r = defineWebhook({ signingSecret: 's', schema, handle });
    expect((await call(r, body, { Signature: 'nope' })).status).toBe(401);
    expect(parsed).toBe(false);
  });

  it('treats a throwing validator as invalid (401)', async () => {
    const r = defineWebhook({
      signingSecret: 's',
      signatureValidator: () => {
        throw new Error('boom');
      },
      handle
    });
    expect((await call(r, body, headers)).status).toBe(401);
  });

  it('keeps the request body readable in handle', async () => {
    let text = '';
    const r = defineWebhook({
      signingSecret: 's',
      handle: async ({ request }) => {
        text = await request.text();
      }
    });
    await call(r, body, headers);
    expect(text).toBe(body);
  });

  it('answers the Slack url_verification challenge from handle', async () => {
    const challenge = JSON.stringify({
      type: 'url_verification',
      challenge: 'abc'
    });
    const ts = now();
    const r = defineWebhook({
      ...slack({ signingSecret: 'sl' }),
      handle: ({ payload }) => {
        const p = payload as { type?: string; challenge?: string };
        if (p.type === 'url_verification')
          return Response.json({ challenge: p.challenge });
      }
    });
    const res = await call(r, challenge, {
      'X-Slack-Request-Timestamp': ts,
      'X-Slack-Signature': 'v0=' + sign('sha256', 'sl', `v0:${ts}:${challenge}`)
    });
    expect(await res.json()).toEqual({ challenge: 'abc' });
  });
});

describe('primitives', () => {
  const req = (headers: Record<string, string>) =>
    new Request('http://localhost/hook', { method: 'POST', body, headers });

  it('verifySignature works on a plain Request and leaves the body unread', async () => {
    const request = req({ Signature: sign('sha256', 's', body) });
    const result = await verifySignature(request, { signingSecret: 's' });
    expect(result).toEqual({ valid: true, rawBody: body });
    expect(await request.text()).toBe(body);
  });

  it('verifySignature throws WebhookConfigError on an empty secret', async () => {
    await expect(
      verifySignature(req({}), { signingSecret: '' })
    ).rejects.toBeInstanceOf(WebhookConfigError);
  });

  it('hmac supports other algorithms, encodings and prefixes', async () => {
    for (const algorithm of ['sha1', 'sha512'] as const) {
      const signatureValidator = hmac({
        algorithm,
        encoding: 'base64',
        prefix: `${algorithm}=`
      });
      const request = req({
        Signature: `${algorithm}=` + sign(algorithm, 's', body, 'base64')
      });
      expect(
        (
          await verifySignature(request, {
            signingSecret: 's',
            signatureValidator
          })
        ).valid
      ).toBe(true);
    }
  });

  it('digest matches node:crypto', async () => {
    expect(await digest('k', 'msg')).toBe(sign('sha256', 'k', 'msg'));
    expect(await digest('k', 'msg', 'sha512', 'base64')).toBe(
      sign('sha512', 'k', 'msg', 'base64')
    );
  });

  it('safeEqual', () => {
    expect(safeEqual('abc', 'abc')).toBe(true);
    expect(safeEqual('abc', 'abd')).toBe(false);
    expect(safeEqual('abc', 'abcd')).toBe(false);
  });

  it('isFresh', () => {
    const at = 1_700_000_000_000;
    expect(isFresh('1700000000', 300, at)).toBe(true);
    expect(isFresh(1_700_000_000 - 301, 300, at)).toBe(false);
    expect(isFresh(1_700_000_000 + 301, 300, at)).toBe(false);
    expect(isFresh('not-a-number', 300, at)).toBe(false);
    expect(isFresh(null, 300, at)).toBe(false);
  });
});

describe('raw bytes (regression)', () => {
  const bom = Buffer.concat([
    Buffer.from([0xef, 0xbb, 0xbf]),
    Buffer.from(body)
  ]);
  const invalidUtf8 = Buffer.from([0x7b, 0xe9, 0x7d]); // "{\xE9}"
  const req = (data: Uint8Array, headers: Record<string, string>) =>
    new Request('http://localhost/hook', {
      method: 'POST',
      body: data as BodyInit,
      headers
    });

  it('verifies a body with a UTF-8 BOM and still parses it', async () => {
    let seen: any;
    const r = defineWebhook({
      signingSecret: 's',
      handle: ({ payload }) => {
        seen = payload;
      }
    });
    expect(
      (await call(r, bom, { Signature: sign('sha256', 's', bom) })).status
    ).toBe(200);
    expect(seen.action).toBe('push');
  });

  it('verifies a body with invalid UTF-8 bytes', async () => {
    const request = req(invalidUtf8, {
      Signature: sign('sha256', 's', invalidUtf8)
    });
    expect((await verifySignature(request, { signingSecret: 's' })).valid).toBe(
      true
    );
  });

  it('slack signs the raw bytes', async () => {
    const ts = now();
    const request = req(invalidUtf8, {
      'X-Slack-Request-Timestamp': ts,
      'X-Slack-Signature':
        'v0=' +
        sign(
          'sha256',
          'sl',
          Buffer.concat([Buffer.from(`v0:${ts}:`), invalidUtf8])
        )
    });
    expect(
      (await verifySignature(request, slack({ signingSecret: 'sl' }))).valid
    ).toBe(true);
  });

  it('stripe signs the raw bytes', async () => {
    const ts = now();
    const request = req(bom, {
      'Stripe-Signature': `t=${ts},v1=${sign('sha256', 'st', Buffer.concat([Buffer.from(`${ts}.`), bom]))}`
    });
    expect(
      (await verifySignature(request, stripe({ signingSecret: 'st' }))).valid
    ).toBe(true);
  });

  it('concatBytes joins text and bytes', () => {
    expect(Buffer.from(concatBytes('a.', new Uint8Array([0xe9]), 'b'))).toEqual(
      Buffer.from([0x61, 0x2e, 0xe9, 0x62])
    );
  });
});

describe('secret resolution errors (regression)', () => {
  const request = () =>
    new Request('http://localhost/hook', {
      method: 'POST',
      body,
      headers: { Signature: 'x' }
    });

  it('wraps a throwing function secret in WebhookConfigError when called without context', async () => {
    const signingSecret = (ctx: any) => ctx.locals.runtime.env.SECRET;
    const err = await verifySignature(request(), { signingSecret }).catch(
      (e) => e
    );
    expect(err).toBeInstanceOf(WebhookConfigError);
    expect(err.cause).toBeInstanceOf(TypeError);
  });

  it('responds 500 when a function secret throws', async () => {
    const r = defineWebhook({
      signingSecret: () => {
        throw new Error('env not available');
      },
      handle
    });
    expect((await call(r, body, { Signature: 'x' })).status).toBe(500);
  });
});

describe('empty form body (regression)', () => {
  it('passes undefined, not {}', async () => {
    let seen: any = 'unset';
    const r = defineWebhook({
      signingSecret: 's',
      handle: ({ payload }) => {
        seen = payload;
      }
    });
    const res = await call(r, '', {
      'content-type': 'application/x-www-form-urlencoded',
      Signature: sign('sha256', 's', '')
    });
    expect(res.status).toBe(200);
    expect(seen).toBeUndefined();
  });
});

# 🚀 Astro Webhooks

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

Astro Webhooks verifies incoming webhooks in Astro endpoints. Each webhook is one endpoint file, and nothing goes in `astro.config`.

- Signature verification against the raw body bytes
- Presets for GitHub, Slack, Stripe and Shopify
- Payload validation with zod from `astro/zod`, or any library with a `parse` method
- Key rotation, and secrets read per request for Cloudflare and other edge runtimes
- Uses only Web Crypto, so it runs on Node, Deno, Bun and edge runtimes

## 📦 Installation

Install the `astro-webhooks` package using your package manager.

Using PNPM

```bash
pnpm install astro-webhooks
```

Using NPM

```bash
npm install astro-webhooks
```

Using Yarn

```bash
yarn add astro-webhooks
```

Webhook endpoints run on demand, so your project needs an [adapter](https://docs.astro.build/en/guides/on-demand-rendering/).

## 🥑 Usage

Create an endpoint and export `defineWebhook(...)` as its `POST` handler:

```ts
// src/pages/webhooks/github.ts
import { defineWebhook, github } from 'astro-webhooks';
import { getSecret } from 'astro:env/server';
import { z } from 'astro/zod';

export const prerender = false; // only needed in static output mode

export const POST = defineWebhook({
  ...github({ signingSecret: () => getSecret('GITHUB_WEBHOOK_SECRET') }),
  schema: z.object({ action: z.string() }).passthrough(),
  handle: async ({ payload, request }) => {
    if (request.headers.get('x-github-event') !== 'push') return; // ignore
    // ...do the work. Throw to make the sender retry (500).
  }
});
```

`defineWebhook` handles each request in this order: verify signature → parse body → validate schema → `handle`.

| Outcome                                       | Status                |
| --------------------------------------------- | --------------------- |
| `handle` returns nothing                      | `200`                 |
| `handle` returns a `Response`                 | that response         |
| Invalid or missing signature                  | `401`                 |
| Body is not valid JSON, or the schema rejects | `400`                 |
| `handle` throws                               | `500`, sender retries |
| Signing secret missing or empty               | `500`                 |

A missing secret never means "accept everything". The endpoint fails closed with a `500`.

`defineWebhook` parses `application/x-www-form-urlencoded` bodies, such as Slack slash commands, into a plain object. An empty body gives an `undefined` payload.

## 📖 Configuration

`defineWebhook` takes a profile:

| Option                | Type                                                             | Description                                                                                     |
| --------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `signingSecret`       | `string \| string[] \| (ctx) => string \| string[] \| undefined` | Required. An array enables key rotation (any match is valid). A function runs on every request. |
| `signatureHeaderName` | `string`                                                         | Header holding the signature. Default `"Signature"`.                                            |
| `signatureValidator`  | `(check) => boolean \| Promise<boolean>`                         | Default `hmac()` (HMAC-SHA256, hex).                                                            |
| `schema`              | `{ parse(data: unknown): T }`                                    | Validates and types the payload. Zod, ArkType, etc.                                             |
| `handle`              | `(event) => Response \| void \| Promise<...>`                    | Receives `{ payload, rawBody, request, context, name }`.                                        |
| `name`                | `string`                                                         | Used in log messages.                                                                           |

### Secrets on edge runtimes

Cloudflare and some other runtimes only expose env inside a request. Pass a function there:

```ts
defineWebhook({
  signingSecret: (ctx) => ctx.locals.runtime.env.WEBHOOK_SECRET,
  handle
});
```

## 🧩 Presets

Presets return `{ signingSecret, signatureHeaderName, signatureValidator }`, so you can spread them into `defineWebhook`:

| Preset      | Header                  | Scheme                                  |
| ----------- | ----------------------- | --------------------------------------- |
| `github()`  | `X-Hub-Signature-256`   | `sha256=` + HMAC-SHA256 hex             |
| `shopify()` | `X-Shopify-Hmac-Sha256` | HMAC-SHA256 base64                      |
| `slack()`   | `X-Slack-Signature`     | `v0=` + HMAC of `v0:{timestamp}:{body}` |
| `stripe()`  | `Stripe-Signature`      | `t=…,v1=…` HMAC of `{timestamp}.{body}` |

`slack()` and `stripe()` reject requests older than `tolerance` seconds, which defaults to `300`. This stops an attacker from replaying a captured request later.

### Slack URL verification

Slack sends a signed `url_verification` event when you register an endpoint. Answer it from `handle`:

```ts
export const POST = defineWebhook({
  ...slack({ signingSecret: () => getSecret('SLACK_SIGNING_SECRET') }),
  handle: ({ payload }) => {
    const event = payload as { type: string; challenge?: string };
    if (event.type === 'url_verification') {
      return Response.json({ challenge: event.challenge });
    }
    // ...
  }
});
```

## 🛠️ Custom providers

Most providers sign the raw body with an HMAC. Describe the scheme with `hmac()`:

```ts
import { defineWebhook, hmac } from 'astro-webhooks';

export const POST = defineWebhook({
  signingSecret: 'secret',
  signatureHeaderName: 'X-Signature',
  signatureValidator: hmac({
    algorithm: 'sha256',
    encoding: 'base64',
    prefix: 'sha256='
  }),
  handle
});
```

`hmac()` supports `sha1`, `sha256` and `sha512`, with `hex` or `base64` encoding. For anything else, write your own validator with these helpers:

- `digest(secret, message, algorithm?, encoding?)`: HMAC via Web Crypto; `message` is a string or bytes
- `concatBytes(...parts)`: joins strings and bytes, e.g. a timestamp prefix and the raw body
- `safeEqual(a, b)`: constant-time string comparison
- `isFresh(timestamp, toleranceSeconds)`: replay-protection check for unix-seconds timestamps

A validator receives `{ request, rawBytes, rawBody, secret, headerName }`. Sign `rawBytes`, the body exactly as received. `rawBody` is that body decoded as UTF-8. Decoding drops a byte-order mark and replaces invalid bytes, so an HMAC of `rawBody` can miss a valid signature.

Here is a validator for a provider that signs `{timestamp}.{body}`:

```ts
import { concatBytes, digest, isFresh, safeEqual } from 'astro-webhooks';

const signatureValidator = async ({ request, rawBytes, secret }) => {
  const timestamp = request.headers.get('X-Timestamp');
  if (!timestamp || !isFresh(timestamp, 300)) return false;
  const expected = await digest(secret, concatBytes(`${timestamp}.`, rawBytes));
  return safeEqual(expected, request.headers.get('X-Signature') ?? '');
};
```

### Verifying outside an endpoint

`verifySignature(request, options, context?)` works on any `Request`, so you can call it from middleware. It reads a clone of the request, and the original body is still readable afterwards:

```ts
import { verifySignature, github } from 'astro-webhooks';

const { valid, rawBody } = await verifySignature(
  request,
  github({ signingSecret })
);
```

It throws a `WebhookConfigError` when the secret is missing or empty, or when a function secret throws. The second case usually means a secret that reads `ctx.locals` was called without a context. The original error is on `cause`.

## Changelog

See the [Changelog](CHANGELOG.md) for recent changes.

<!-- Readme Badges -->

[npm]: https://npmjs.com/package/astro-webhooks
[version-badge]: https://img.shields.io/npm/v/astro-webhooks.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-webhooks
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://npmjs.com/package/astro-webhooks
[typescript-badge]: https://img.shields.io/npm/types/astro-webhooks
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

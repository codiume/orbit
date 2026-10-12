import type { APIContext } from 'astro';

type MaybePromise<T> = T | Promise<T>;

/** What a validator receives. `secret` is a single, already-resolved secret. */
export interface SignatureCheck {
  request: Request;
  /** Body bytes exactly as received. Always sign these, never re-serialized JSON. */
  rawBytes: Uint8Array;
  /** Body decoded as UTF-8 text. Convenient for parsing, but may differ from `rawBytes` (BOM, invalid bytes). */
  rawBody: string;
  secret: string;
  headerName: string;
}

export type SignatureValidator = (
  check: SignatureCheck
) => MaybePromise<boolean>;

/**
 * A string, several strings (key rotation: any match is valid), or a function
 * resolved per request, which is what you need on runtimes where env is per-request
 * (e.g. Cloudflare: `(ctx) => ctx.locals.runtime.env.SECRET`).
 */
export type Secret =
  | string
  | string[]
  | ((context: APIContext) => MaybePromise<string | string[] | undefined>);

/** Anything with a `parse` method: zod (`astro/zod`), arktype, etc. */
export interface Schema<T> {
  parse(data: unknown): T;
}

export interface SignatureOptions {
  signingSecret: Secret;
  /** Default: "Signature" */
  signatureHeaderName?: string;
  /** Default: hmac() (HMAC-SHA256, hex) */
  signatureValidator?: SignatureValidator;
}

export interface WebhookEvent<T> {
  payload: T;
  rawBody: string;
  request: Request;
  context: APIContext;
  name?: string;
}

export interface WebhookProfile<T = unknown> extends SignatureOptions {
  /** Optional, used in logs. */
  name?: string;
  /** Validates and types the payload. Failure responds 400. */
  schema?: Schema<T>;
  /** Return early to ignore an event. Return a Response to customize the reply. Throw to make the sender retry (500). */
  handle: (event: WebhookEvent<T>) => MaybePromise<Response | void>;
}

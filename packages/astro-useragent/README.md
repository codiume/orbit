# 🚀 Astro UserAgent

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

Astro UserAgent is a simple helper for parsing `user-agent` header strings for browser matching inside your Astro Pages / API routes, when using [SSR Mode][astro-ssr]

> **Note** Due to the nature of Astro being an SSG by trade, This package only works when used with Astro in [SSR Mode][astro-ssr].

## 📦 Installation

First, install the `astro-useragent` package using your package manager. (If you aren’t sure which package manager you’re using, run the first command.)

Using PNPM

```bash
pnpm install astro-useragent
```

Using NPM

```bash
npm install astro-useragent
```

Using Yarn

```bash
yarn add astro-useragent
```

## 🥑 Usage

### Enable SSR mode

To get started, enable SSR features in development mode with the `output: server` configuration option:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'server'
});
```

> **Note** For more info about SSR mode, please refer to the official [docs][astro-ssr].

### Usage with Astro pages

To parse a `user-agent` string inside any of your top level Astro pages, import `useUserAgent` and then use it inside the frontmatter section:

```astro layout.astro
---
import { useUserAgent } from 'astro-useragent';

const uaString = Astro.request.headers.get('user-agent');
const { source, isMobile } = useUserAgent(uaString);
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>My Astro website</title>
  </head>
  <body>
    <p>Source: {source}</p>
    {isMobile ? <p>I'm on mobile</p> : <p>I'm on desktop</p>}
  </body>
</html>
```

> **Note** Read more about Astro request headers here: [Astro Docs](https://docs.astro.build/en/guides/server-side-rendering/#astrorequestheaders)

### Usage with Astro API routes

`useUserAgent` can also be used inside your API routes, to perform some logic based on the client user-agent.

In the example below, an API route is used to redirect a user to a different mobile page when he is using a mobile client, otherwise it serves the normal content.

```typescript
import type { APIContext } from 'astro';
import { useUserAgent } from 'astro-useragent';

export async function get({ request }: APIContext) {
  const uaString = request.headers.get('user-agent');
  const { isMobile } = useUserAgent(uaString);

  if (isMobile) {
    return Response.redirect('mobile.mysite.com', 307);
  }

  const greetings = {
    message: 'hello from astro API'
  };

  return new Response(JSON.stringify(greetings), {
    status: 200
  });
}
```

> **Note** Read more about Astro API routes here: [Astro Docs](https://docs.astro.build/en/guides/server-side-rendering/#api-routes)

We have also setup an example repository available here: [example-useragent](../../apps/example-useragent)

### Parsed object interface

The parsed `UserAgent` object will have the following interface:

```typescript
export interface UserAgent {
  readonly source: string | null; // The original user agent string.
  readonly browser: string | null;
  readonly browserVersion: number;
  readonly cpu: string | null;
  readonly deviceType: string | null;
  readonly deviceVendor: string | null;
  readonly engine: string | null;
  readonly engineVersion: number | null;
  readonly os: string | null;
  readonly osVersion: number | null;
  readonly isAndroid: boolean;
  readonly isChrome: boolean;
  readonly isChromeOS: boolean;
  readonly isDesktop: boolean;
  readonly isEdge: boolean;
  readonly isFirefox: boolean;
  readonly isIE: boolean;
  readonly isIos: boolean;
  readonly isIpad: boolean;
  readonly isIphone: boolean;
  readonly isMac: boolean;
  readonly isMobile: boolean;
  readonly isOpera: boolean;
  readonly isSafari: boolean;
  readonly isTablet: boolean;
  readonly isWindows: boolean;
  readonly isBot: boolean;
  readonly isAIBot: boolean;
  readonly isChromeFamily: boolean;
  readonly isAppleSilicon: boolean;
  getUA(): string;
  getBrowser(): IBrowser;
  getCPU(): ICPU;
  getDevice(): IDevice;
  getEngine(): IEngine;
  getOS(): IOS;
}
```

## Caveats

UserAgent-based mobile detection isn’t always accurate. Instead, use the following client-side function:

```javascript
function isMobile() {
  const match = window.matchMedia('(pointer:coarse)');
  return match && match.matches;
}
```

## Changelog

Please see the [Changelog](CHANGELOG.md) for more information on what has changed recently.

## Acknowledgements

`astro-useragent` is a port from [next-useragent][next-useragent] to Astro. so big thanks to the contributors behind next-useragent package.

[astro-ssr]: https://docs.astro.build/en/guides/server-side-rendering
[npm]: https://npmjs.com/package/astro-useragent
[next-useragent]: https://github.com/warent/next-useragent

<!-- Readme Badges -->

[version-badge]: https://img.shields.io/npm/v/astro-useragent.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-useragent
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://npmjs.com/package/astro-useragent
[typescript-badge]: https://img.shields.io/npm/types/astro-useragent
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

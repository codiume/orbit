# AGENTS.md

## Install

```bash
pnpm add astro-gtm
```

Or:

```bash
npm install astro-gtm
```

## Usage

Add to any Astro page or layout:

```astro
---
import { GoogleTagManager } from 'astro-gtm';
---

<GoogleTagManager gtmId="GTM-XXXXXXX" />
```

Place inside `<body>` tag.

## Environment Variables

Create `.env` file:

```
PUBLIC_GTM_ID=GTM-XXXXXXX
```

Add TypeScript types in `src/env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly PUBLIC_GTM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## API Props

| Prop              | Required | Default     | Description                     |
| ----------------- | -------- | ----------- | ------------------------------- |
| `gtmId`           | Yes      | -           | GTM container ID                |
| `dataLayer`       | No       | -           | Object with data to pass to GTM |
| `dataLayerName`   | No       | `dataLayer` | Custom dataLayer name           |
| `includeNoScript` | No       | `true`      | Include noscript iframe         |
| `enableInDevMode` | No       | `false`     | Enable in development           |
| `auth`            | No       | -           | GTM preview auth                |
| `preview`         | No       | -           | GTM preview environment ID      |
| `defaultConsent`  | No       | -           | GDPR consent mode v2 settings   |

## Build

No build step required. Package exports client-side component.

## Test

Run Astro dev server and verify GTM script loads in page source.

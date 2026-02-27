# AGENTS.md

## Install

```bash
pnpm install schema-dts astro-seo-schema
```

Or:

```bash
npm install schema-dts astro-seo-schema
```

## Usage

Add to `<head>` section of any Astro page:

```astro
---
import { Schema } from 'astro-seo-schema';
---

<html>
  <head>
    <Schema
      item={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Name'
      }}
    />
  </head>
</html>
```

## API Props

| Prop   | Required | Type   | Description               |
| ------ | -------- | ------ | ------------------------- |
| `item` | Yes      | object | Schema.org JSON-LD object |

## Build

No build step required. Component renders at build time.

## Test

View page source and verify `<script type="application/ld+json">` tag is present.

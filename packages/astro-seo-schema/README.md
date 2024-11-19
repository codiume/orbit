# 🚀 Astro JSON-LD Schema

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

Easily insert valid Schema.org JSON-LD in your Astro apps.

The `<Schema>` component is inspired by [`react-schemaorg`](https://www.npmjs.com/package/react-schemaorg) and powered by the [`schema-dts`](https://www.npmjs.com/package/schema-dts) package for full TypeScript definitions.

This `<Schema>` component:

1. Adds type checking to validate user-provided schema JSON
2. Escapes the JSON data.
3. Outputs a `<script type="type="application/ld+json">` with the escaped schema.

## 📦 Installation

First, install the `schema-dts` & `astro-seo-schema` packages using your package manager. (If you aren’t sure which package manager you’re using, run the first command.)

Using PNPM

```bash
pnpm install schema-dts astro-seo-schema
```

Using NPM

```bash
npm install schema-dts astro-seo-schema
```

Using Yarn

```bash
yarn add schema-dts astro-seo-schema
```

## 🥑 Usage

To insert a simple JSON-LD snippet in any of your Astro pages, import `Schema` component and then use the component inside the `<head>` section of your HTML:

```jsx index.astro
---
import { Schema } from "astro-seo-schema"
---

<html lang="en">
    <head>
        <Schema
            item={{
                "@context": "https://schema.org",
                "@type": "Person",
                name: "Grace Brewster",
                alternateName: "Grace Brewster Murray Hopper",
                alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: ["Yale University", "Vassar College"],
                },
                knowsAbout: ["Compilers", "Computer Science"],
            }}
        />
    </head>

    <body>
        <h1>Hello from astro</h1>
    </body>
</html>
```

## Looking for a simpler approach ?

If you are not into `schema.org` and want a simpler approach,
you might want to check another alternative [astro-seo-meta][astro-seo-meta].

`astro-seo-meta` helps you to add tags that are relevant for search engine optimization (SEO) to your astro pages.

## Changelog

Please see the [Changelog](CHANGELOG.md) for more information on what has changed recently.

## Acknowledgements

- [React Schemaorg][react-schemaorg]
- [Tony Sull RFC][tony-sull]

<!-- Links -->

[npm]: https://npmjs.com/package/astro-seo-schema
[astro-seo-meta]: https://npmjs.com/package/astro-seo-meta
[react-schemaorg]: https://www.npmjs.com/package/react-schemaorg
[tony-sull]: https://github.com/tony-sull/rfcs/blob/main/proposals/025-seo-components.md

<!-- Readme Badges -->

[version-badge]: https://img.shields.io/npm/v/astro-seo-schema.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-seo-schema
[github-actions]: https://github.com/codiume/orbit/actions/workflows/node.js.yml
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg?branch=main
[typescript]: https://npmjs.com/package/astro-seo-schema
[typescript-badge]: https://img.shields.io/npm/types/astro-seo-schema
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square?style=flat

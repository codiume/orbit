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

## 🤖 Getting Started with AI

Paste this into your AI coding tool and let it handle the setup:

### Set up structured data

```text
Install astro-seo-schema and its schema-dts peer dependency in this Astro project, then read `node_modules/astro-seo-schema/README.md` to learn the API. Ask me what this site is (a business, a person, a blog, a store, ...) and add the `Schema` component from `astro-seo-schema` to the `<head>` of my base layout with a matching `WebSite` and `Organization` or `Person` item. Use the `schema-dts` types so mistakes fail the type check, and don't make up details like addresses or social profiles: ask me for them.
```

Then cover the rest of the site. Rich results depend on each page type having its own schema:

### Add per-page schema

```text
Find the page types in this project (blog posts, products, events, FAQs, ...) and add the matching schema.org type to each, filled from the page's frontmatter or content collection data: for example `BlogPosting` with headline, dates and author, or `Product` with offers. Run the type check, then show me the rendered JSON-LD for one page of each type so I can test it in Google's Rich Results Test before moving on.
```

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

```astro index.astro
---
import { Schema } from 'astro-seo-schema';
---

<html lang="en">
  <head>
    <Schema
      item={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Grace Brewster',
        alternateName: 'Grace Brewster Murray Hopper',
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: ['Yale University', 'Vassar College']
        },
        knowsAbout: ['Compilers', 'Computer Science']
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
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

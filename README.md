# 🚀 Astro JSON-LD Schema (WIP)

> This package is still (WIP) not version is available

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

The `<Schema>` component is inspired by [`react-schemaorg`](https://www.npmjs.com/package/react-schemaorg) and powered by the [`schema-dts`](https://www.npmjs.com/package/schema-dts) package for full TypeScript definitions.

The component (1) adds type checking to validate user-provided schema JSON, (2) escapes the JSON data, and (3) outputs a `<script type="type="application/ld+json">` with the escaped schema.

Users can provide one or more schema object. If an array of related objects is provided, they will be included in a graph schema with the `@graph` syntax.

## 📦 Installation

This package is hosted on [`npm`][npm].

```bash
npm install astro-seo-schema
```

Or using yarn

```bash
yarn add astro-seo-schema
```

## 🥑 Usage

To add a base set of SEO tags in any of your Astro pages, import Astro `Seo` and then use the component inside the `<head>` section of your HTML:

```jsx index.astro
---
import { Schema } from "astro-seo-schema"
import { BlogPosting } from 'schema-dts';

/** metadata defined by user with full TypeScript validation from `schema-dts` */
const schema: BlogPosting = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://astro.build/blog/astro-1/"
  },
  "headline": "We are thrilled to announce Astro v1.0: a web framework for building fast, content-focused websites.",
  "description": "Astro 1.0 is out now! Astro is a web framework for building fast, content-focused websites. Performance powered by Astro next-gen island architecture. Learn more about Astro 1.0 release, our new website, and what people are saying about Astro.",
  "image": "https://astro.build/_image/assets/blog/astro-1-release-update/social_1200x600.jpg",  
  "author": {
    "@type": "Person",
    "name": "Fred Schott",
    "url": "https://twitter.com/FredKSchott"
  },  
  "publisher": {
    "@type": "Organization",
    "name": "",
    "logo": {
      "@type": "ImageObject",
      "url": ""
    }
  },
  "datePublished": "2022-08-09"
}
---

<html lang="en">
    <head>
        <Schema json={schema} />
    </head>

    <body>
        <h1>Hello from astro</h1>
    </body>
</html>
```

## Change log

Please see the [changelog](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [contributing.md](CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email author instead of using the issue tracker.

## Acknowledgements

- [https://github.com/tony-sull/rfcs/blob/main/proposals/025-seo-components.md]
- [https://www.npmjs.com/package/react-schemaorg]
  
## License

license. Please see the [license file](LICENSE) for more information.

[npm]: https://npmjs.com/package/astro-seo-schema

<!-- Readme Badges -->
[version-badge]: https://img.shields.io/npm/v/astro-seo-schema.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-seo-schema
[size-badge]: https://img.shields.io/bundlephobia/minzip/astro-seo-schema
[github-actions]: https://github.com/codiume/astro-seo-schema/actions
[github-actions-badge]: https://github.com/codiume/astro-seo-schema/actions/workflows/node.js.yml/badge.svg
[typescript]: https://www.typescriptlang.org/dt/search?search=astro-seo-schema
[typescript-badge]: https://img.shields.io/npm/types/astro-seo-schema
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square?style=flat

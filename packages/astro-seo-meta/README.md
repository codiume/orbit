# 🚀 Astro SEO Meta

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

This [Astro](https://astro.build/) component makes it easy to add tags that are relevant for search engine optimization (SEO) to your pages.

It supports [Facebook][facebook], [Twitter][twitter-cards], [Open Graph][og], and `meta` tags.

## 📦 Installation

Install using pnpm:

```bash
pnpm add astro-seo-meta
```

Or using npm:

```bash
npm install astro-seo-meta
```

Or using yarn:

```bash
yarn add astro-seo-meta
```

## 🥑 Usage

To add a base set of SEO tags in any of your Astro pages, import Astro `Seo` and then use the component inside the `<head>` section of your HTML:

```jsx index.astro
---
import { Seo } from "astro-seo-meta"
---

<html lang="en">
  <head>
    <Seo
      title="My astro website"
      description="My fast astro website"
      icon="/favicon.ico"
    />
  </head>

  <body>
    <h1>Hello from astro</h1>
  </body>
</html>
```

## 📖 API Reference

### `<Seo>`

| Name             | Required | Example                           | Description                                                       |
| :--------------- | :------: | :-------------------------------- | :---------------------------------------------------------------- |
| `title`          | `false`  | `"My Astro website"`              | Page title.                                                       |
| `description`    | `false`  | `"My blazing fast Astro website"` | Description of the page.                                          |
| `keywords`       | `false`  | `["website", "blog", "astro"]`    | Array of keywords.                                                |
| `icon`           | `false`  | `"/favicon.ico"`                  | Tab icon URL.                                                     |
| `themeColor`     | `false`  | `"#000000"`                       | Browser theme color.                                              |
| `colorScheme`    | `false`  | `"light"`                         | Preferred color scheme.                                           |
| `robots`         | `false`  | `"index, follow"`                 | string of robots directives (e.g., `index`, `noindex`, `follow`). |
| `facebook.image` | `false`  | `"/facebook.png"`                 | Facebook share image.                                             |
| `facebook.url`   | `false`  | `"https://astro.build"`           | Page URL.                                                         |
| `facebook.type`  | `false`  | `"website"`                       | Type of resource. See all types [here][types].                    |
| `twitter.image`  | `false`  | `"/twitter.png"`                  | Twitter share image.                                              |
| `twitter.site`   | `false`  | `"@astrodotbuild"`                | Twitter handle of the publishing site.                            |
| `twitter.card`   | `false`  | `"summary"`                       | Format of Twitter share card. See all types [here][cards].        |

All of the `Seo` props are optional. If a prop is not provided, the associated meta tag will not be rendered.

```jsx
// renders no seo tags
<Seo/>

// renders all seo tags
<Seo
  title="My Astro website"
  description="My blazing fast astro website"
  keywords={["website", "blog", "astro"]}
  icon="/favicon.ico"
  themeColor="#000000"
  colorScheme="light"
  robots="index, follow"
  facebook={{
    image: "/facebook.png",
    url: "https://astro.build",
    type: "website",
  }}
  twitter={{
    image: "/twitter.png",
    site: "@astrodotbuild",
    card: "summary",
  }}
/>

// renders some seo tags
<Seo
  title="My Astro website"
  description="My blazing fast astro website"
  keywords={["website", "blog", "technology"]}
/>
```

## What does this component do, exactly?

This package adds all the necessary and SEO-relevant HTML tags inside your page's `<head>` tag.

## Change log

Please see the [changelog](CHANGELOG.md) for more information on what has changed recently.

## Acknowledgements

Astro Seo Meta is _heavily_ inspired by [Next SEO][next-seo] and all the amazing work the Brad Garropy is doing developing it. Thanks [Brad][bradgarropy]! ❤️

Also great thanks to [Jonas Schumacher][jonasmerlin] Author of [Astro SEO](https://github.com/jonasmerlin/astro-seo). ❤️

[og]: https://ogp.me
[types]: https://ogp.me/#types
[bradgarropy]: https://github.com/bradgarropy
[npm]: https://npmjs.com/package/astro-seo-meta
[next-seo]: https://github.com/bradgarropy/next-seo
[facebook]: https://developers.facebook.com/docs/sharing/webmasters
[twitter-cards]: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/markup
[cards]: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
[jonasmerlin]: https://github.com/jonasmerlin

<!-- Readme Badges -->

[version-badge]: https://img.shields.io/npm/v/astro-seo-meta.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-seo-meta
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://npmjs.com/package/astro-seo-meta
[typescript-badge]: https://img.shields.io/npm/types/astro-seo-meta
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

# 🚀 Astro Google Tag Manager

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

This [Astro](https://astro.build/) plugin makes it easy to integrate [Google Tag Manager](https://tagmanager.google.com/) into your project, letting you manage marketing and analytics tags directly from your Astro website.

## 📦 Installation

Install using pnpm:

```bash
pnpm add astro-gtm
```

Or using npm:

```bash
npm install astro-gtm
```

Or using yarn:

```bash
yarn add astro-gtm
```

## 🥑 Usage

```jsx layout.astro
---
import { GoogleTagManager } from "astro-gtm"
---

<html lang="en">
<head>
</head>

<body>
  <GoogleTagManager id="GTM-XXXXXXX" />
  <slot />
</body>
</html>
```

## 📖 API Reference

### `<GoogleTagManager>`

| Name              | Required | Default | Example                        | Description                                                                              |
| :---------------- | :------: | :-----: | :----------------------------- | :--------------------------------------------------------------------------------------- |
| `gtmId`           |  `Yes`   |    -    | `'GTM-XXXXXXX'`                | Google Tag Manager container ID.                                                         |
| `dataLayer`       |   `No`   |    -    | `{ userId: '123', page: '/' }` | Object that contains all of the information that you want to pass to Google Tag Manager. |
| `dataLayerName`   |   `No`   |    -    | `'dataLayer'`                  | Custom name for dataLayer object.                                                        |
| `includeNoScript` |   `No`   | `true`  | `false`                        | Whether to include the noscript iframe.                                                  |
| `enableInDevMode` |   `No`   | `false` | `true`                         | Whether to enable Google Tag Manager in development mode.                                |

All props except `gtmId` are optional. The component will not render in development mode unless `enableInDevMode` is set to `true`.

## What does this component do, exactly?

This package adds the necessary Google Tag Manager scripts to your page's `<body>` tag, with support for custom data layers, noscript fallbacks, and development mode configuration.

## Changelog

Please see the [changelog](CHANGELOG.md) for more information on what has changed recently.

<!-- Readme Badges -->

[npm]: https://npmjs.com/package/astro-gtm
[version-badge]: https://img.shields.io/npm/v/astro-gtm.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-gtm
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://npmjs.com/package/astro-gtm
[typescript-badge]: https://img.shields.io/npm/types/astro-gtm
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

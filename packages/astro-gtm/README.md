# 🚀 Astro Google Tag Manager

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

This [Astro](https://astro.build/) plugin makes it easy to integrate [Google Tag Manager](https://tagmanager.google.com/) into your project, allowing you to manage marketing and analytics tags without modifying your codebase directly.

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
    <GoogleTagManager id: 'GTM-000000'/>
  </head>

  <body>
    <h1>Hello from astro</h1>
  </body>
</html>
```

## 📖 API Reference

TBA

## What does this component do, exactly?

This package adds the necessary google tag manager scripts inside your page's `<head>` tag.

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

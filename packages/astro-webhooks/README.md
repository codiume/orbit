# 🚀 Astro Webhooks (WIP)

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

Astro Webhooks helps you receive webhooks calls in your Astro apps.

> **Note:**
>
> This integration is still a work in progress! As we iron out the kinks, We'll let you know when it's ready for prime time.

## 📦 Installation

### Quick Install

the `astro add` command-line tool automates the installation for you. Run one of the following commands in a new terminal window. (If you aren’t sure which package manager you’re using, run the first command.) Then, follow the prompts, and type “y” in the terminal (meaning “yes”) for each one.

```bash
# Using PNPM
pnpm astro add astro-webhooks
# Using NPM
npx astro add astro-webhooks
# Using Yarn
yarn astro add astro-webhooks
```

### Manual Install

First, install the `astro-webhooks` package using your package manager. (If you aren’t sure which package manager you’re using, run the first command.)

Using PNPM

```bash
pnpm install astro-webhooks
```

Using NPM

```bash
npm install astro-webhooks
```

Using Yarn

```bash
yarn add astro-webhooks
```

Then, apply this integration to your `astro.config.mjs` file using the integrations property:

```js
import webhooks from 'astro-webhooks';

export default {
  // ...
  integrations: [webhooks()]
};
```

## 🥑 Usage

When you install this integration, things will be auto-wired for you.

## 📖 Configuration

This Astro integration allow you to pass those options easily in your `astro.config.mjs` file:

```js
export default defineConfig({
  integrations: [
    webhooks({
      endpoints: []
    })
  ]
});
```

### Available Options

Here is a list of options, that are allowed to be passed in the config:

```ts
export type WebhookOptions = {};
```

## Changelog

Please see the [Changelog](CHANGELOG.md) for more information on what has changed recently.

<!-- Readme Badges -->

[npm]: https://npmjs.com/package/astro-webhooks
[version-badge]: https://img.shields.io/npm/v/astro-webhooks.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-webhooks
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://www.typescriptlang.org/dt/search?search=astro-webhooks
[typescript-badge]: https://img.shields.io/npm/types/astro-webhooks
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square?style=flat

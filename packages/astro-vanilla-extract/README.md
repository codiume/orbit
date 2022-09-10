# 🚀 Astro Vanilla Extract

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

This astro integration adds Vanilla Extract support to astro

## 📦 Installation

### Quick Install

the `astro add` command-line tool automates the installation for you. Run one of the following commands in a new terminal window. (If you aren’t sure which package manager you’re using, run the first command.) Then, follow the prompts, and type “y” in the terminal (meaning “yes”) for each one.

```bash
# Using NPM
npx astro add astro-vanilla-extract
# Using Yarn
yarn astro add astro-vanilla-extract
# Using PNPM
pnpm astro add astro-vanilla-extract
```

### Manual Install

First, install the `astro-vanilla-extract` package using your package manager. (If you aren’t sure which package manager you’re using, run the first command.)

```bash
# Using NPM
npm install astro-vanilla-extract
# Using Yarn
yarn add astro-vanilla-extract
# Using PNPM
pnpm install astro-vanilla-extract
```

Then, apply this integration to your `astro.config.mjs` file using the integrations property:

```js
import vanillaExtract from 'astro-vanilla-extract';

export default {
  // ...
  integrations: [vanillaExtract()]
};
```

## 🥑 Usage

When you install this integration, things will be auto-wired for you. and all your generated css files should be purged from unused classes automagically.

## 📖 Configuration

[vanilla-extract][vanilla-extract] has a list of options that allow you to customize its behavior. And this Astro integration allow you to pass those options easily in your `astro.config.mjs` file:

```js
export default defineConfig({
  // Add purgeCss support to Astro
  integrations: [
    cssPurge({
      fontFace: true,
      keyframes: true,
      safelist: ['random', 'yep', 'button', /^nav-/],
      blocklist: ['usedClass', /^nav-/]
    })
  ]
});
```

### Available Options

Here is a list of options, that are allowed to be passed in the config:

```ts
export type PurgeCSSOptions = {
  fontFace?: boolean;
  keyframes?: boolean;
  rejected?: boolean;
  rejectedCss?: boolean;
  variables?: boolean;
  safelist?: UserDefinedSafelist;
  blocklist?: StringRegExpArray;
};
```

## Changelog

Please see the [Changelog](CHANGELOG.md) for more information on what has changed recently.

## Acknowledgements

- [vanilla-extract][vanilla-extract]

[npm]: https://npmjs.com/package/astro-vanilla-extract
[vanilla-extract]: https://vanilla-extract.style/

<!-- Readme Badges -->

[version-badge]: https://img.shields.io/npm/v/astro-vanilla-extract.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-vanilla-extract
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://www.typescriptlang.org/dt/search?search=astro-vanilla-extract
[typescript-badge]: https://img.shields.io/npm/types/astro-vanilla-extract
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square?style=flat

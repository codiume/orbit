# 🚀&nbsp;Astro + 🧁&nbsp;vanilla-extract

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

This integration adds [vanilla-extract][vanilla-extract] support to [Astro][astro]

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

When you install this integration, things will be auto-wired for you.

To learn more about using Vanilla Extract library, head to the [vanilla-extract][vanilla-extract] official documentation.

### Example

You can also check the following example [Repository][ave-example]

## Changelog

Please see the [Changelog](CHANGELOG.md) for more information on what has changed recently.

## Acknowledgements

- [vanilla-extract][vanilla-extract]

[npm]: https://npmjs.com/package/astro-vanilla-extract
[vanilla-extract]: https://vanilla-extract.style/
[astro]: https://astro.build
[ave-example]: https://github.com/codiume/astro-vanilla-extract-example

<!-- Readme Badges -->

[version-badge]: https://img.shields.io/npm/v/astro-vanilla-extract.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-vanilla-extract
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://www.typescriptlang.org/dt/search?search=astro-vanilla-extract
[typescript-badge]: https://img.shields.io/npm/types/astro-vanilla-extract
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square?style=flat

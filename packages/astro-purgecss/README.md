# 🚀 Astro Purgecss

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

[Purgecss][purgecss] helps you remove unused CSS rules from your final astro bundle.

## 📦 Installation

### Quick Install

the `astro add` command-line tool automates the installation for you. Run one of the following commands in a new terminal window. (If you aren’t sure which package manager you’re using, run the first command.) Then, follow the prompts, and type “y” in the terminal (meaning “yes”) for each one.

```bash
# Using NPM
npx astro add astro-purgecss
# Using Yarn
yarn astro add astro-purgecss
# Using PNPM
pnpm astro add astro-purgecss
```

### Manual Install

First, install the `astro-purgecss` package using your package manager. (If you aren’t sure which package manager you’re using, run the first command.)

```bash
# Using NPM
npm install astro-purgecss
# Using Yarn
yarn add astro-purgecss
# Using PNPM
pnpm install astro-purgecss
```

Then, apply this integration to your `astro.config.mjs` file using the integrations property:

```js
import purgecss from 'astro-purgecss';

export default {
  // ...
  integrations: [purgecss()]
};
```

> **Note**
>
> To make sure this integration works properly, it's recommended to put `purgecss()`
> as the last element in the `integrations` array.

## 🥑 Usage

When you install this integration, things will be auto-wired for you. and all your generated css files should be purged from unused classes automagically.

## 📖 Configuration

[PurgeCSS][purgecss] has a list of options that allow you to customize its behavior. And this Astro integration allow you to pass those options easily in your `astro.config.mjs` file:

```js
export default defineConfig({
  integrations: [
    purgecss({
      fontFace: true,
      keyframes: true,
      safelist: ['random', 'yep', 'button', /^nav-/],
      blocklist: ['usedClass', /^nav-/]
    })
  ]
});
```

### Using Tailwind

[PurgeCSS][purgecss] is known to remove some tailwind specifique classes. so make sure to pass `tailwind` flag to your config, if you are using tailwind.css.

```js
export default defineConfig({
  integrations: [
    purgecss({
      tailwind: true
    })
  ]
});
```

### Available Options

Here is a list of options, that are allowed to be passed in the config:

```ts
export type PurgeCSSOptions = {
  tailwind?: boolean;
  fontFace?: boolean;
  keyframes?: boolean;
  rejected?: boolean;
  rejectedCss?: boolean;
  variables?: boolean;
  safelist?: UserDefinedSafelist;
  blocklist?: StringRegExpArray;
};
```

To learn more about the available options, please refer to [PurgeCSS][purgecss-options] official docs.

### Caveats

Certain options (ex: `css`, `content`), are not allowed to be passed in your `astro.config.mjs` config file, to not interfere with the internals of this integration.

## Changelog

Please see the [Changelog](CHANGELOG.md) for more information on what has changed recently.

## Acknowledgements

- [Purgecss][purgecss]

[npm]: https://npmjs.com/package/astro-purgecss
[purgecss]: https://purgecss.com
[purgecss-options]: https://purgecss.com/configuration.html#options

<!-- Readme Badges -->

[version-badge]: https://img.shields.io/npm/v/astro-purgecss.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-purgecss
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://www.typescriptlang.org/dt/search?search=astro-purgecss
[typescript-badge]: https://img.shields.io/npm/types/astro-purgecss
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square?style=flat

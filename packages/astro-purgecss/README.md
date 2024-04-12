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
# Using PNPM
pnpm astro add astro-purgecss
# Using NPM
npx astro add astro-purgecss
# Using Yarn
yarn astro add astro-purgecss
```

### Manual Install

First, install the `purgecss` & `astro-purgecss` packages using your package manager. (If you aren’t sure which package manager you’re using, run the first command.)

Using PNPM

```bash
pnpm install purgecss astro-purgecss
```

Using NPM

```bash
npm install purgecss astro-purgecss
```

Using Yarn

```bash
yarn add purgecss astro-purgecss
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
      blocklist: ['usedClass', /^nav-/],
      content: [
        process.cwd() + '/src/**/*.{astro,vue}' // Watching astro and vue sources (for SSR, read the note below)
      ],
      extractors: [
        {
          // Example using a taiwindcss compatible class extractor
          extractor: (content) =>
            content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
          extensions: ["astro", "html"],
        },
      ],
    })
  ]
});
```

> **Note**
>
> If you are using **Astro SSR** in your project, you must add your astro and framework sources files into the `content` option (see in the example). Otherwise, as the package only look at the final build sent to the client, with SSR, some pages may not be included and may break your CSS.

### Available Options

Here is a list of options, that are allowed to be passed in the config:

```ts
export type PurgeCSSOptions = {
  fontFace?: boolean; // removes any unused @font-face if set to true
  keyframes?: boolean; // removes unused keyframes by setting if set to true
  rejected?: boolean; // scan through the removed list to see if there's anything wrong
  rejectedCss?: boolean; // keeps the discarded CSS
  variables?: boolean; // removes any unused CSS variables if set to true
  safelist?: UserDefinedSafelist; // indicates which selectors are safe to leave in the final CSS
  blocklist?: StringRegExpArray; // blocks the CSS selectors from appearing in the final output CSS
  content?: Array<string | RawContent>;
  extractors?:  // provides custom functions to extract CSS classes in specific ways (eg. when using tailwind.css) 
    Array<{
      extractor: (content: string) => string[]; // matched css classes
      extensions: string[]; // file extensions for which this extractor is to be used
    }>;
};
```

To learn more about the available options, please refer to [PurgeCSS][purgecss-options] official docs.

We have also setup an example repository available here: [example-purgecss](../../apps/example-purgecss)

### Caveats

- Some options are not allowed to be passed in your `astro.config.mjs` config file, to not interfere with the internals of this integration.

- If you are using [inline styles](https://docs.astro.build/en/guides/styling/#scoped-styles), this plugin won't be able to purge those css rules, due to astro's way of handling scoped css rules.


- If you are using Astro view transitions, use the following options so that purgecss keeps the corresponding animations:
```diff
export default defineConfig({
  integrations: [
    purgecss({
+      keyframes: false
+      , safelist: {
+        greedy: [/*astro*/]
+      }
    }),
  ],
});
```

- If you are using `tailwind.css`, please read about purge limitations in this guide [writing-purgeable-html](https://v2.tailwindcss.com/docs/optimizing-for-production#writing-purgeable-html). You may also need a custom class extractor compatible with arbitrary and container based `tailwind.css` classes. For example:
```js
export default defineConfig({
  integrations: [
    purgecss({
      extractors: [
        {
          extractor: (content) =>
            content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
          extensions: ["astro", "html"],
        },
      ],
    }),
  ],
});
```

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

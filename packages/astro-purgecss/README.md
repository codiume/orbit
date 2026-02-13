# 🚀 Astro Purgecss

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

[Purgecss][purgecss] helps you remove unused CSS rules from your final astro bundle.

## 📦 Installation

### ⚡ Quick Install

the `astro add` command-line tool automates the installation for you. Run one of the following commands in a new terminal window. (If you aren’t sure which package manager you’re using, run the first command.) Then, follow the prompts, and type “y” in the terminal (meaning “yes”) for each one.

```bash
# Using PNPM
pnpm astro add astro-purgecss
# Using NPM
npx astro add astro-purgecss
# Using Yarn
yarn astro add astro-purgecss
```

### 🔧 Manual Install

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

However, there's one small caveat: By default, Astro inlines small CSS files as part of its [bundle control](https://docs.astro.build/en/guides/styling/#bundle-control). This means that the plugin won't be able to purge CSS rules from those inlined files. To prevent Astro from inlining CSS styles, you can set the `inlineStylesheets` option to `never` in your `astro.config.mjs` file:

```diff
export default defineConfig({
+  build: {
+    inlineStylesheets: 'never'
+  }
});
```

## ⚙️ Configuration

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
        process.cwd() + '/src/**/*.{astro,vue}' // Watching astro and vue sources (read SSR docs below)
      ],
      extractors: [
        {
          // Example using a tailwindcss compatible class extractor
          extractor: (content) =>
            content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
          extensions: ['astro', 'html']
        }
      ]
    })
  ]
});
```

### 📖 Available Options

Here is a list of options, that are allowed to be passed in the config:

```typescript
export type PurgeCSSOptions = {
  fontFace?: boolean; // removes any unused @font-face if set to true
  keyframes?: boolean; // removes unused keyframes by setting if set to true
  rejected?: boolean; // scan through the removed list to see if there's anything wrong
  rejectedCss?: boolean; // keeps the discarded CSS
  variables?: boolean; // removes any unused CSS variables if set to true
  safelist?: UserDefinedSafelist; // indicates which selectors are safe to leave in the final CSS
  blocklist?: StringRegExpArray; // blocks the CSS selectors from appearing in the final output CSS
  content?: Array<string | RawContent>;
  // provides custom functions to extract CSS classes in specific ways (eg. when using tailwind.css)
  extractors?: {
    extractor: (content: string) => string[]; // matched css classes
    extensions: string[]; // file extensions for which this extractor is to be used
  }[];
  strategy?: 'default' | 'cache-buster';
};
```

To learn more about the available options, please refer to [PurgeCSS][purgecss-options] official docs.

## 🎯 Strategies

This integration supports two strategies for handling CSS file hashes after purging. Choose the strategy that best fits your deployment and caching needs.

### `default` (Recommended)

The default strategy recalculates CSS file hashes based on the purged content and renames the files accordingly. This ensures the filename hash accurately reflects the final CSS content after unused rules are removed. best for static site generation (`output: 'static'`)

```js
export default defineConfig({
  integrations: [
    purgecss({
      strategy: 'default' // default, can be omitted
    })
  ]
});
```

- **Known issues:** See [#1000](https://github.com/codiume/orbit/issues/1000) for edge cases with certain build configurations.

### `cache-buster`

The cache-buster strategy injects a random UUID comment into each CSS file during the build process. This causes Vite to generate unique filename hashes automatically, without requiring manual file renaming.

```js
export default defineConfig({
  integrations: [
    purgecss({
      strategy: 'cache-buster'
    })
  ]
});
```

**When to use:**

- Quick deployments where cache busting is more important than optimization
- SSR builds where you prefer consistent behavior across modes

**Notes:**

- ⚠️ **Non-deterministic**: Every build generates different filenames, even with identical content
- ⚠️ **Cache invalidation**: Forces browsers to download CSS on every deployment

**Example repository:** [example-purgecss](../../apps/example-purgecss)

## 🌐 SSR Mode

If you are using **Astro SSR** in your project, you must add your Astro and framework source files into the `content` option (see example below). Since the integration analyzes the final client-side build, some SSR-rendered pages might not be included in the initial scan, which could result in necessary CSS being incorrectly purged.

Example configuration for SSR:

```js
export default defineConfig({
  integrations: [
    purgecss({
      content: [
        './src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}'
        // Add any other template files that contain styles
      ]
    })
  ]
});
```

### Important Notes

1. **CSS Retention**: Due to the integration's file scanning approach, some unused CSS might be retained. This is a deliberate trade-off to prevent accidentally removing dynamically used styles.

2. **Inline Styles vs External Stylesheets**: The integration can more accurately analyze and purge external stylesheets compared to inline styles embedded within components:
   - ✅ **Recommended**: Use external stylesheet files (`.css`)
   - ⚠️ **Less Effective**: Inline styles in component files

## ⚠️ Caveats

- Some options are not allowed to be passed in your `astro.config.mjs` config file, to not interfere with the internals of this integration.

- If you are using Astro view transitions, use the following options so that purgecss keeps the corresponding animations:

```js
export default defineConfig({
  integrations: [
    purgecss({
      keyframes: false,
      safelist: {
        greedy: [
          /*astro*/
        ]
      }
    })
  ]
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
          extensions: ['astro', 'html']
        }
      ]
    })
  ]
});
```

- If you have CSS files that are shared between both SSR and static pages, it's recommended to use the `cache-buster` strategy, See issue [#1000](https://github.com/codiume/orbit/issues/1000). The `default` strategy only processes static build output, which means SSR-rendered pages might reference outdated CSS filenames after the files are renamed during the build process. The `cache-buster` strategy avoids this issue by letting Vite handle hash generation without requiring file renaming:

```js
export default defineConfig({
  output: 'server',
  integrations: [
    purgecss({
      strategy: 'cache-buster' // Recommended for SSR builds with shared CSS
    })
  ]
});
```

## ⚠️ Advanced: Overriding Content Sources (`__unsafeContent`)

> **WARNING**: This is an advanced option that should only be used as a last resort for performance issues on extremely large sites.

By default, `astro-purgecss` scans all HTML and JavaScript files in your build output to determine which CSS classes are in use:

```js
// Default content sources (added automatically):
[`${outDir}/**/*.html`, `${outDir}/**/*.js`];
```

For very large sites (e.g., 120,000+ pages), these globs can cause "Maximum call stack size exceeded" errors or severe performance degradation, see [1001](https://github.com/codiume/orbit/issues/1001).

The `__unsafeContent` option allows you to **completely override** the default content sources with your own custom array. When this option is provided, the default globs are **completely ignored**.

### Usage Example

```js
export default defineConfig({
  integrations: [
    purgecss({
      // ⚠️ WARNING: This completely bypasses default content scanning!
      // Only use if the default globs cause performance issues.
      // Ensure you include ALL files that contain CSS class references.
      __unsafeContent: [
        // Scan only JS files from the build output (skip HTML files)
        process.cwd() + '/dist/**/*.js',
        // Scan source files to catch SSR-rendered classes
        process.cwd() + '/src/**/*.{astro,vue,jsx,tsx}'
      ]
    })
  ]
});
```

### ⚠️ Important Warnings

1. **Complete Override**: When `__unsafeContent` is provided, the default globs (`${outDir}/**/*.html` and `${outDir}/**/*.js`) are **completely ignored**. Make sure your custom content array includes all necessary sources.

2. **Risk of Over-Purging**: If your content array doesn't include all files that reference CSS classes, those classes will be incorrectly removed from your final CSS bundle, breaking your site's styling.

## 📝 Changelog

Please see the [Changelog](CHANGELOG.md) for more information on what has changed recently.

## 💝 Acknowledgements

- [Purgecss][purgecss]

[npm]: https://npmjs.com/package/astro-purgecss
[purgecss]: https://purgecss.com
[purgecss-options]: https://purgecss.com/configuration.html#options

<!-- Readme Badges -->

[version-badge]: https://img.shields.io/npm/v/astro-purgecss.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-purgecss
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://npmjs.com/package/astro-purgecss
[typescript-badge]: https://img.shields.io/npm/types/astro-purgecss
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

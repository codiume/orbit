# AGENTS.md

## Install

Quick install:

```bash
pnpm astro add astro-purgecss
```

Or manual install:

```bash
pnpm install purgecss astro-purgecss
```

## Configure

Add to `astro.config.mjs`:

```javascript
import purgecss from 'astro-purgecss';

export default {
  integrations: [purgecss()]
};
```

Place `purgecss()` as last element in integrations array.

## Prevent CSS Inlining

Add to `astro.config.mjs` to enable purging inlined CSS:

```javascript
export default {
  build: {
    inlineStylesheets: 'never'
  }
};
```

## API Options

| Option       | Type                          | Description                 |
| ------------ | ----------------------------- | --------------------------- |
| `fontFace`   | `boolean`                     | Remove unused @font-face    |
| `keyframes`  | `boolean`                     | Remove unused keyframes     |
| `variables`  | `boolean`                     | Remove unused CSS variables |
| `safelist`   | `array`                       | selectors to keep           |
| `blocklist`  | `array`                       | selectors to remove         |
| `content`    | `array`                       | files to scan for classes   |
| `extractors` | `array`                       | custom class extractors     |
| `strategy`   | `'default' \| 'cache-buster'` | Build strategy              |

## SSR Mode

Add source files to content option:

```javascript
integrations: [
  purgecss({
    content: ['./src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}']
  })
];
```

## Tailwind CSS

Use custom extractor:

```javascript
integrations: [
  purgecss({
    extractors: [
      {
        extractor: (content) => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
        extensions: ['astro', 'html']
      }
    ]
  })
];
```

## Astro View Transitions

Prevent animation purge:

```javascript
integrations: [
  purgecss({
    keyframes: false,
    safelist: { greedy: [/^astro-/] }
  })
];
```

## Build

Run:

```bash
pnpm astro build
```

## Test

Verify CSS file sizes are reduced. Check for missing styles in browser.

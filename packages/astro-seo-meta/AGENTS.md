# AGENTS.md

## Install

```bash
pnpm add astro-seo-meta
```

Or:

```bash
npm install astro-seo-meta
```

## Usage

Add to `<head>` section of any Astro page:

```astro
---
import { Seo } from 'astro-seo-meta';
---

<html>
  <head>
    <Seo
      title="Page Title"
      description="Page description"
      icon="/favicon.ico"
    />
  </head>
</html>
```

## API Props

| Prop             | Required | Description            |
| ---------------- | -------- | ---------------------- |
| `title`          | No       | Page title             |
| `description`    | No       | Page description       |
| `keywords`       | No       | Array of keywords      |
| `icon`           | No       | Favicon URL            |
| `themeColor`     | No       | Browser theme color    |
| `colorScheme`    | No       | Preferred color scheme |
| `robots`         | No       | Robots directives      |
| `facebook.image` | No       | Facebook share image   |
| `facebook.url`   | No       | Page URL               |
| `facebook.type`  | No       | OG type                |
| `twitter.image`  | No       | Twitter share image    |
| `twitter.site`   | No       | Twitter handle         |
| `twitter.card`   | No       | Twitter card type      |

## Build

No build step required. Component renders at build time.

## Test

View page source and verify meta tags are present in `<head>`.

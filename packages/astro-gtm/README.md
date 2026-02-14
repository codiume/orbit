# 🚀 Astro Google Tag Manager

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]
[![Built with Astro][astro-badge]][astro]

This [Astro](https://astro.build/) plugin makes it easy to integrate [Google Tag Manager](https://tagmanager.google.com/) into your project, letting you manage marketing and analytics tags directly from your Astro website.

## 📋 Requirements

- Astro 5.0 or higher
- A Google Tag Manager account and container ID

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

Add the `GoogleTagManager` component to your layout or page:

```astro
---
import { GoogleTagManager } from 'astro-gtm';
---

<html lang="en">
  <head>
    <!-- Your head content -->
  </head>

  <body>
    <GoogleTagManager gtmId="GTM-XXXXXXX" />
    <slot />
  </body>
</html>
```

## 🔐 Using Environment Variables

It's recommended to store your GTM ID in environment variables rather than hardcoding it:

### Step 1: Create `.env` file

```bash
# .env file in your project root
PUBLIC_GTM_ID=GTM-XXXXXXX
```

**Important:** Use the `PUBLIC_` prefix for environment variables that need to be available in client-side code.

### Step 2: Use in your component

```astro
---
import { GoogleTagManager } from 'astro-gtm';
---

<html lang="en">
  <head>
    <!-- Your head content -->
  </head>

  <body>
    <GoogleTagManager gtmId={import.meta.env.PUBLIC_GTM_ID} />
    <slot />
  </body>
</html>
```

### Step 3: Add TypeScript types (optional)

Create or update `src/env.d.ts`:

```typescript
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GTM_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

This provides autocompletion and type safety for your environment variables.

## 📖 API Reference

### `<GoogleTagManager>`

| Name              | Required |    Default    | Example                        | Description                                                                              |
| :---------------- | :------: | :-----------: | :----------------------------- | :--------------------------------------------------------------------------------------- |
| `gtmId`           |  `Yes`   |       -       | `'GTM-XXXXXXX'`                | Google Tag Manager container ID.                                                         |
| `dataLayer`       |   `No`   |       -       | `{ userId: '123', page: '/' }` | Object that contains all of the information that you want to pass to Google Tag Manager. |
| `dataLayerName`   |   `No`   | `'dataLayer'` | `'customDataLayer'`            | Custom name for dataLayer object.                                                        |
| `includeNoScript` |   `No`   |    `true`     | `false`                        | Whether to include the noscript iframe.                                                  |
| `enableInDevMode` |   `No`   |    `false`    | `true`                         | Whether to enable Google Tag Manager in development mode.                                |
| `auth`            |   `No`   |  `undefined`  | `'WFcfQBD6HDw'`                | Set preview auth for GTM workspace previews.                                             |
| `preview`         |   `No`   |  `undefined`  | `'env-XXX'`                    | Set preview environment ID for GTM workspace previews.                                   |
| `defaultConsent`  |   `No`   |  `undefined`  | `{ ad_storage: 'denied' }`     | Default consent state for Google Consent Mode v2. Required for GDPR compliance.          |

All props except `gtmId` are optional. The component will not render in development mode unless `enableInDevMode` is set to `true`.

## 🛡️ GDPR Compliance with Consent Mode

Google Tag Manager supports Consent Mode v2, which is required for GDPR compliance in Europe. This package makes it easy to set default consent states before GTM initializes.

### Setting Default Consent

```astro
---
import { GoogleTagManager } from 'astro-gtm';
---

<GoogleTagManager
  gtmId="GTM-XXXXXXX"
  defaultConsent={{
    // Set default consent to 'denied' as a placeholder
    // Determine actual values based on your own requirements
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  }}
/>
```

### Updating Consent After User Accepts

After the user accepts cookies through your consent banner, update the consent state:

```html
<script>
  // In your consent banner component or script
  function allConsentGranted() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push([
      'consent',
      'update',
      {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted'
      }
    ]);
  }
</script>
<!-- Invoke your consent functions when a user interacts with your banner -->
<button onclick="allConsentGranted()">Yes</button>
```

### Available Consent Types

| Type                      | Description                               |
| :------------------------ | :---------------------------------------- |
| `ad_storage`              | Enables storage for advertising purposes  |
| `analytics_storage`       | Enables storage for analytics purposes    |
| `ad_user_data`            | Consent for sending user data to Google   |
| `ad_personalization`      | Consent for personalized advertising      |
| `functionality_storage`   | Enables storage for website functionality |
| `personalization_storage` | Enables storage for personalization       |
| `security_storage`        | Enables storage for security purposes     |

**Note:** When `defaultConsent` is omitted, no consent mode is configured and GTM behaves according to your tag configuration.

**Learn more:** [Google Consent Mode Documentation](https://developers.google.com/tag-platform/security/guides/consent)

## 🔍 How It Works

This package adds the necessary Google Tag Manager scripts to your page's `<body>` tag. It:

1. Creates a data layer with your custom data
2. Injects the GTM script in the head of your document
3. Adds a noscript fallback (optional)
4. Automatically disables itself in development mode (unless explicitly enabled)

## 📝 Changelog

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
[astro]: https://astro.build
[astro-badge]: https://astro.badg.es/v2/built-with-astro/tiny.svg

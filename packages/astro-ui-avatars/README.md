# 🧔 Astro UI Avatars

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

This [Astro](https://astro.build/) package provides you with a component to generate avatars with initials from names.

## 📦 Installation

Install using pnpm

```bash
pnpm add astro-ui-avatars
```

Or using npm

```bash
npm install astro-ui-avatars
```

Or using yarn

```bash
yarn add astro-ui-avatars
```

## 🥑 Usage

To generate a user avatar in any of your Astro pages or components, just import the `Avatar` component from `astro-ui-avatars` and use it inside your HTML:

```jsx index.astro
---
import { Avatar } from "astro-ui-avatars"
---

<html lang="en">
  <body>
    <p>User Avatar:</p>
    <Avatar name="John Doe" />
  </body>
</html>
```

## 📖 API Reference

| Name         | Required | Example      | Description                                     |
| :----------- | :------: | :----------- | :---------------------------------------------- |
| `name`       | `false`  | `"John Doe"` | The name to be displayed in the avatar.         |
| `size`       | `false`  | `50`         | The size of the avatar.                         |
| `background` | `false`  | `"#000000"`  | The background color of the avatar.             |
| `color`      | `false`  | `"#FFFFFF"`  | The text color of the avatar.                   |
| `length`     | `false`  | `2`          | The number of initials to display.              |
| `fontSize`   | `false`  | `20`         | The font size of the initials.                  |
| `rounded`    | `false`  | `true`       | Whether the avatar should have rounded corners. |
| `uppercase`  | `false`  | `true`       | Whether the initials should be in uppercase.    |
| `bold`       | `false`  | `true`       | Whether the initials should be bold.            |

All `Avatar` props are optional. If no props are provided, the avatar will use default settings.

## Changelog

Please see the [changelog](CHANGELOG.md) for more information on what has changed recently.

[npm]: https://npmjs.com/package/astro-ui-avatars

<!-- Readme Badges -->

[version-badge]: https://img.shields.io/npm/v/astro-ui-avatars.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-ui-avatars
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://npmjs.com/package/astro-ui-avatars
[typescript-badge]: https://img.shields.io/npm/types/astro-ui-avatars
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square?style=flat

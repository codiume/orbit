# 🚀 Astro SVG Loaders

[![version][version-badge]][npm]
[![downloads][downloads-badge]][npm]
[![github actions][github-actions-badge]][github-actions]
[![typescript][typescript-badge]][typescript]
[![makepr][makepr-badge]][makepr]

This [Astro](https://astro.build/) package provides you with a collection of loading animations built with pure SVG by the amazing **@sherb**.

## 📦 Installation

This package is hosted on [`npm`][npm].

```bash
npm install astro-svg-loaders
```

Or using yarn

```bash
yarn add astro-svg-loaders
```

## 🥑 Usage

To add a loading indicator in any of your Astro pages or components, just import a loader from `astro-svg-loaders` then use it inside the your HTML:

```jsx index.astro
---
import { Hearts } from "astro-svg-loaders"
---

<html lang="en">
    <body>
        // renders a spining cercle animation
        <p>Please wait while content is loading</p>
        <SpinningCircles />
    </body>
</html>
```

List of all available loaders:

> **Note**
>
> You can check a demo of all the available animations [here][demo]

```jsx
// renders all available loader animations
<Audio />
<BallTriangle />
<Bars />
<Circles />
<Grid />
<Hearts />
<Oval />
<Puff />
<Rings />
<SpinningCircles />
<TailSpin />
<ThreeDots />
```

## Change log

Please see the [changelog](CHANGELOG.md) for more information on what has changed recently.

## Acknowledgements

Astro SVG Loaders relies _heavily_ on the amazing work **Sam Herbert** is doing developing: [SVG-Loaders][svg-loaders] , Thanks [Sam][sam-herbert]! ❤️

[npm]: https://npmjs.com/package/astro-svg-loaders
[svg-loaders]: https://github.com/SamHerbert/SVG-Loaders
[sam-herbert]: https://github.com/SamHerbert
[demo]: https://samherbert.net/svg-loaders

<!-- Readme Badges -->

[version-badge]: https://img.shields.io/npm/v/astro-svg-loaders.svg
[downloads-badge]: https://img.shields.io/npm/dt/astro-svg-loaders
[github-actions]: https://github.com/codiume/orbit/actions
[github-actions-badge]: https://github.com/codiume/orbit/actions/workflows/node.js.yml/badge.svg
[typescript]: https://www.typescriptlang.org/dt/search?search=astro-svg-loaders
[typescript-badge]: https://img.shields.io/npm/types/astro-svg-loaders
[makepr]: https://makeapullrequest.com
[makepr-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square?style=flat

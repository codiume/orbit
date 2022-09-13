import { defineConfig } from 'astro/config';
import purgecss from 'astro-purgecss';
import vanillaExtract from 'astro-vanilla-extract';

// https://astro.build/config
export default defineConfig({
  // Add purgecss support to Astro
  integrations: [
    vanillaExtract(),
    purgecss({
      fontFace: true,
      keyframes: true,
      safelist: ['random', 'yep', 'button', /^nav-/],
      blocklist: ['usedClass', /^nav-/]
    })
  ]
});

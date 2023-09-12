import { defineConfig } from 'astro/config';
import purgecss from 'astro-purgecss';

export default defineConfig({
  // Add purgecss support to Astro
  integrations: [
    purgecss({
      fontFace: true,
      keyframes: true,
      safelist: ['random', 'yep', 'button', /^nav-/],
      blocklist: ['usedClass', /^nav-/]
    })
  ]
});

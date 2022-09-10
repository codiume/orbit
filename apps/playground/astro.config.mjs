import { defineConfig } from 'astro/config';
import cssPurge from 'astro-purgecss';

// https://astro.build/config
export default defineConfig({
  // Add purgeCss support to Astro
  integrations: [
    cssPurge({
      fontFace: true,
      keyframes: true,
      safelist: ['random', 'yep', 'button', /^nav-/],
      blocklist: ['usedClass', /^nav-/]
    })
  ]
});

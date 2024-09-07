import { defineConfig } from 'astro/config';
import purgecss from '../../packages/astro-purgecss/src/index';

export default defineConfig({
  // Add purgecss support to Astro
  integrations: [
    purgecss({
      fontFace: true,
      keyframes: true,
      safelist: ['random', 'yep', 'button', /^nav-/],
      blocklist: ['usedClass', /^nav-/]
    })
  ],
  build: {
    inlineStylesheets: 'never'
  }
});

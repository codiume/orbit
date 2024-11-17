import purgecss from 'astro-purgecss';
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

export default defineConfig({
  // Add purgecss support to Astro
  integrations: [
    purgecss({
      fontFace: true,
      keyframes: true,
      safelist: ['random', 'yep', 'button', /^nav-/],
      blocklist: ['usedClass', /^nav-/],
      content: [process.cwd() + '/src/**/*.astro']
    })
  ],

  output: 'server',

  build: {
    format: 'preserve',
    inlineStylesheets: 'never'
  },

  adapter: node({
    mode: 'standalone'
  })
});

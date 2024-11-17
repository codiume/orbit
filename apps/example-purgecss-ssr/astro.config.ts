import { defineConfig } from 'astro/config';
import purgecss from '../../packages/astro-purgecss/src';

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

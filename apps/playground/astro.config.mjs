import { defineConfig } from 'astro/config';
import cssPurge from 'astro-purgecss';

// https://astro.build/config
export default defineConfig({
  // Add purgeCss support to Astro
  integrations: [cssPurge()]
});

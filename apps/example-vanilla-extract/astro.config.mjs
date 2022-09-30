import { defineConfig } from 'astro/config';

import vanillaExtract from "astro-vanilla-extract";

// https://astro.build/config
export default defineConfig({
  integrations: [vanillaExtract()]
});
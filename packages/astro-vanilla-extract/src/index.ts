import type { AstroIntegration } from 'astro';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default function (): AstroIntegration {
  return {
    name: 'astro-vanilla-extract',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [vanillaExtractPlugin()]
          }
        });
      }
    }
  };
}

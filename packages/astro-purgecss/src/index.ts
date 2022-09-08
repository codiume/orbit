import type { AstroIntegration } from 'astro';
import { PurgeCSS } from 'purgecss';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export default function (): AstroIntegration {
  return {
    name: 'astro-purgecss',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const purged = await new PurgeCSS().purge({
          content: [`${outDir}/**/*.html`],
          css: [`${outDir}/**/*.css`]
        });
        await Promise.all(
          purged
            .filter(({ file }) => file.endsWith('.css'))
            .map(async ({ css, file }) => await writeFile(file, css))
        );
      }
    }
  };
}

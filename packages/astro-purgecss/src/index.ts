import type { AstroIntegration } from 'astro';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PurgeCSS, StringRegExpArray, UserDefinedSafelist } from 'purgecss';

export type PurgeCSSOptions = {
  fontFace?: boolean;
  keyframes?: boolean;
  rejected?: boolean;
  rejectedCss?: boolean;
  variables?: boolean;
  safelist?: UserDefinedSafelist;
  blocklist?: StringRegExpArray;
};

export default function (options: PurgeCSSOptions = {}): AstroIntegration {
  return {
    name: 'astro-purgecss',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = fileURLToPath(dir);
        const purged = await new PurgeCSS().purge({
          ...options,
          content: [`${outDir}/**/*.html`],
          css: [`${outDir}/**/*.css`],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
        });
        await Promise.all(
          purged
            .filter(({ file }) => file?.endsWith('.css'))
            .map(async ({ css, file }) => file && (await writeFile(file, css)))
        );
      }
    }
  };
}

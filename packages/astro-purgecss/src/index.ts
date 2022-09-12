import type { AstroIntegration } from 'astro';
import { PurgeCSS, StringRegExpArray, UserDefinedSafelist } from 'purgecss';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export type PurgeCSSOptions = {
  tailwind?: boolean;
  fontFace?: boolean;
  keyframes?: boolean;
  rejected?: boolean;
  rejectedCss?: boolean;
  variables?: boolean;
  safelist?: UserDefinedSafelist;
  blocklist?: StringRegExpArray;
};

// see https://github.com/codiume/orbit/issues/37
const tailwindAwareExtractor = (content) =>
  [...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
    ([_match, group, ..._rest]) => group
  );

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
          defaultExtractor: options.tailwind
            ? tailwindAwareExtractor
            : undefined
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

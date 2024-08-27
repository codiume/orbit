import type { AstroIntegration } from 'astro';
import { fileURLToPath } from 'node:url';
import { PurgeCSS, type UserDefinedOptions } from 'purgecss';

import { resolveOutputPath, writeCssFile } from './utils';

export interface PurgeCSSOptions extends Partial<UserDefinedOptions> {}

function Plugin(options: PurgeCSSOptions = {}): AstroIntegration {
  return {
    name: 'astro-purgecss',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = resolveOutputPath(fileURLToPath(dir));
        const purged = await new PurgeCSS().purge({
          css: [`${outDir}/**/*.css`],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
          ...options,
          content: [
            `${outDir}/**/*.html`,
            `${outDir}/**/*.js`,
            ...(options.content || [])
          ]
        });
        await Promise.all(
          purged
            .filter(({ file }) => file?.endsWith('.css'))
            .map(
              async ({ css, file }) => await writeCssFile({ css, file, outDir })
            )
        );
      }
    }
  };
}

export default Plugin;

import type { AstroIntegration } from 'astro';
import { PurgeCSS, type UserDefinedOptions } from 'purgecss';

import {
  cleanPath,
  headline,
  replaceValueInFile,
  success,
  writeCssFile
} from './utils';

export interface PurgeCSSOptions extends Partial<UserDefinedOptions> {}

function Plugin(options: PurgeCSSOptions = {}): AstroIntegration {
  return {
    name: 'astro-purgecss',
    hooks: {
      'astro:build:done': async ({ dir, routes }) => {
        headline('Generating purged css files...');

        const outDir = cleanPath(dir);
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

        const processed = await Promise.all(
          purged
            .filter(({ file }) => file?.endsWith('.css'))
            .map(async ({ css, file }) => {
              const processed = await writeCssFile({ css, file } as {
                css: string;
                file: string;
              });
              success(processed[1].replace(outDir, '/'));

              return processed;
            })
        );

        headline('Generating purged html pages...');
        const pages = routes
          .filter((route) => {
            if (
              route.pathname === undefined ||
              route.distURL === undefined ||
              route.type !== 'page'
            ) {
              return false;
            }

            return true;
          })
          .map((route) => cleanPath(route.distURL as URL));

        for (const page of pages) {
          for (const [oldFilename, newFilename] of processed) {
            await replaceValueInFile(page, oldFilename, newFilename);
          }
          success(page.replace(outDir, '/'));
        }
      }
    }
  };
}

export default Plugin;

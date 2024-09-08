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
              success(processed[1].replace(outDir, ''));

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

        await Promise.all(
          pages.map(async (page) => {
            await Promise.all(
              processed.map(async ([oldFile, newFile]) => {
                // Replace only if name of the old file
                // is different from name of the new file (hash changes)
                if (oldFile !== newFile) {
                  await replaceValueInFile(
                    page,
                    oldFile.replace(outDir, ''),
                    newFile.replace(outDir, '')
                  );
                }
              })
            );
            success(page.replace(outDir, ''));
          })
        );
      }
    }
  };
}

export default Plugin;

import type { AstroIntegration } from 'astro';
import { createHash } from 'crypto';
import { rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PurgeCSS, type UserDefinedOptions } from 'purgecss';
import { handleWindowsPath, replaceStringInDirectory } from './utils';

export interface PurgeCSSOptions extends Partial<UserDefinedOptions> {}

export default function (options: PurgeCSSOptions = {}): AstroIntegration {
  return {
    name: 'astro-purgecss',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = handleWindowsPath(fileURLToPath(dir));
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
            .map(async ({ css, file }) => {
              if (!file) return;

              await writeFile(file, css);

              // Get content hash
              const hash = await createHash('sha256')
                .update(css)
                .digest('hex')
                .substring(0, 7);

              // Rename file
              const newPath = file.slice(0, -12) + hash + '.css';
              await rename(file, newPath);

              // Replace old name references by newPath
              await replaceStringInDirectory(
                outDir + '../',
                path.basename(file),
                path.basename(newPath)
              );
            })
        );
      }
    }
  };
}

import type { AstroIntegration } from 'astro';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { PurgeCSS, type UserDefinedOptions } from 'purgecss';

export interface PurgeCSSOptions extends Partial<UserDefinedOptions> {}

function handleWindowsPath(outputPath: string): string {
  if (process.platform !== 'win32') return outputPath;

  if (outputPath.endsWith('\\')) {
    outputPath = outputPath.substring(0, outputPath.length - 1);
  }
  outputPath = outputPath.replaceAll('\\', '/');

  return outputPath;
}

function Plugin(options: PurgeCSSOptions = {}): AstroIntegration {
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
            .map(async ({ css, file }) => await writeFile(file!, css))
        );
      }
    }
  };
}

export default Plugin;

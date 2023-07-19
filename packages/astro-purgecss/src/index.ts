import type { AstroIntegration } from 'astro';
import { PurgeCSS, StringRegExpArray, UserDefinedSafelist } from 'purgecss';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export type PurgeCSSOptions = {
  fontFace?: boolean;
  keyframes?: boolean;
  rejected?: boolean;
  rejectedCss?: boolean;
  variables?: boolean;
  safelist?: UserDefinedSafelist;
  blocklist?: StringRegExpArray;
  content?: Array<string | RawContent>;
};

function handleWindowsPath(outputPath: string): string {
  if (process.platform !== 'win32') return outputPath;

  if (outputPath.endsWith('\\')) {
    outputPath = outputPath.substring(0, outputPath.length - 1);
  }
  outputPath = outputPath.replaceAll('\\', '/');

  return outputPath;
}

export default function (options: PurgeCSSOptions = {}): AstroIntegration {
  return {
    name: 'astro-purgecss',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = handleWindowsPath(fileURLToPath(dir));
        const purged = await new PurgeCSS().purge({
          ...options,
          content: [
            `${outDir}/**/*.html`,
            `${outDir}/**/*.js`,
            ...options.content || []
        ],
          css: [`${outDir}/**/*.css`],
          defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || []
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

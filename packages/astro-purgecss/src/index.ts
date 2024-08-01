import type { AstroIntegration } from 'astro';
import { createHash } from 'crypto';
import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
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

async function replaceStringInFile(
  filePath: string,
  searchValue: string,
  replaceValue: string
) {
  try {
    const fileContent = await readFile(filePath, 'utf8');
    if (fileContent.includes(searchValue)) {
      const re = new RegExp(searchValue, 'g');
      const newContent = fileContent.replace(re, replaceValue);
      await writeFile(filePath, newContent, 'utf8');
    }
  } catch (err) {
    console.error(`Error processing file ${filePath}: ${err}`);
  }
}

async function replaceStringInDirectory(
  directory: string,
  searchValue: string,
  replaceValue: string
) {
  try {
    const files = await readdir(directory, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(directory, file.name);
      if (file.isDirectory()) {
        await replaceStringInDirectory(fullPath, searchValue, replaceValue);
      } else if (file.isFile()) {
        await replaceStringInFile(fullPath, searchValue, replaceValue);
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${directory}: ${err}`);
  }
}

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

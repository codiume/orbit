import type { AstroIntegration } from 'astro';
import { promises as fs } from 'node:fs';
import { readFile, rename, writeFile } from 'node:fs/promises';
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

async function getHashFromFile(fileBuffer: BufferSource) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex.substring(0, 7);
}

async function replaceStringInFile(
  filePath: string,
  searchString: string,
  replaceString: string
): Promise<void> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    if (data.includes(searchString)) {
      const updatedData = data.split(searchString).join(replaceString);
      await fs.writeFile(filePath, updatedData, 'utf8');
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

async function processDirectory(
  dir: string,
  searchString: string,
  replaceString: string
): Promise<void> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await processDirectory(fullPath, searchString, replaceString);
      } else if (entry.isFile()) {
        await replaceStringInFile(fullPath, searchString, replaceString);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
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
              const hash = await getHashFromFile(await readFile(file));

              // Rename file
              const newPath = file.slice(0, -12) + hash + '.css';
              await rename(file, newPath);

              // Replace old name references by newPath
              const oldName = file.split('/').pop();
              const newName = newPath.split('/').pop();
              if (oldName && newName) {
                await processDirectory(outDir + '../', oldName, newName);
              }
            })
        );
      }
    }
  };
}

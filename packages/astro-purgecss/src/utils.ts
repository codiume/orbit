import { createHash } from 'node:crypto';
import { readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

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
      const fullPath = join(directory, file.name);
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

export function resolveOutputPath(outputPath: string): string {
  if (process.platform !== 'win32') return outputPath;

  // Remove trailing backslash if present
  outputPath = outputPath.replace(/\\+$/, '');

  // Replace all backslashes with forward slashes
  return outputPath.replace(/\\/g, '/');
}

export async function writeCssFile({
  css,
  file,
  outDir
}: {
  css: string;
  file?: string;
  outDir: string;
}) {
  if (!file) return;

  // Get content hash before writing to file
  const hash = createHash('sha256').update(css).digest('hex').substring(0, 8);

  // Generate new file name with hash
  // Astro orignal hash is 8 characters long
  const newFile = `${file.slice(0, -13)}.${hash}.css`;

  // Write purged CSS to new file
  await writeFile(newFile, css);

  // Remove old file
  await unlink(file);

  // Replace old name references with new file name
  await replaceStringInDirectory(
    dirname(outDir), // Search from parent directory
    basename(file),
    basename(newFile)
  );

  return newFile;
}

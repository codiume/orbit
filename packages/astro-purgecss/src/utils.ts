import { createHash } from 'node:crypto';
import { readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

async function* walkDirectory(dir: string): AsyncIterable<string> {
  const files = await readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = join(dir, file.name);
    if (file.isDirectory()) {
      yield* walkDirectory(filePath);
    } else if (file.isFile()) {
      yield filePath;
    }
  }
}

async function processFile(
  filePath: string,
  searchValue: string,
  replaceValue: string
) {
  try {
    const content = await readFile(filePath, 'utf8');
    if (content.includes(searchValue)) {
      const newContent = content.replace(
        new RegExp(searchValue, 'g'),
        replaceValue
      );
      await writeFile(filePath, newContent, 'utf8');
    }
  } catch (err) {
    console.error(`Error processing file ${filePath}: ${err}`);
  }
}

export function resolveOutputPath(outputPath: string): string {
  if (process.platform !== 'win32') return outputPath;

  // Remove trailing backslash if present
  const output = outputPath.replace(/\\+$/, '');

  // Replace all backslashes with forward slashes
  return output.replace(/\\/g, '/');
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
  for await (const filePath of walkDirectory(dirname(outDir))) {
    await processFile(filePath, basename(file), basename(newFile));
  }

  return newFile;
}

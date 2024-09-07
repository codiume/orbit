import { blue, dim, green } from 'kleur/colors';
import { createHash } from 'node:crypto';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export async function replaceValueInFile(
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

// Clean from extra slash on windows
export function cleanPath(file: URL): string {
  const path = fileURLToPath(file);

  if (process.platform !== 'win32') return path;

  // Remove leading and trailing backslashes if present
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

export async function writeCssFile({
  css,
  file
}: {
  css: string;
  file: string;
}) {
  // Get content hash before writing to file
  const hash = createHash('sha256').update(css).digest('hex').substring(0, 8);

  // Generate new file name with hash
  // Astro orignal hash is 8 characters long
  const newFile = `${file.slice(0, -13)}.${hash}.css`;

  // Write purged CSS to new file
  await writeFile(newFile, css);

  // Remove old file
  await unlink(file);

  return [file, newFile];
}

export const dt = new Intl.DateTimeFormat('en-us', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

export function success(message: string) {
  const date = dt.format(new Date());
  console.log(dim(date), green('▶'), message);
}

export function headline(message: string) {
  const date = dt.format(new Date());
  console.log(dim(date), blue('[build]'), message);
}

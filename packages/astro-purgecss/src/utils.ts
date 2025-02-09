import { dim, green, red } from 'kleur/colors';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export async function readFileContent(filePath: string): Promise<string> {
  try {
    const content = await readFile(filePath, 'utf8');
    return content;
  } catch (err) {
    error(`Error reading file ${filePath}: ${err}`);
    return '';
  }
}

export async function writeFileContent(filePath: string, content: string) {
  try {
    await writeFile(filePath, content, 'utf8');
  } catch (err) {
    error(`Error writing file ${filePath}: ${err}`);
  }
}

export async function writeCssFile(
  newFilePath: string,
  css: string,
  oldFilePath: string
) {
  await writeFileContent(newFilePath, css);

  // Remove old file if it exists and is different from new file
  if (existsSync(oldFilePath) && oldFilePath !== newFilePath) {
    await unlink(oldFilePath);
  }
}

export function generateFileHash(filePath: string, content: string) {
  // Get content hash before writing to file
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 8);

  // Generate new file name with hash
  // Astro original hash is 8 characters long
  return `${filePath.slice(0, -13)}.${hash}.css`;
}

// Clean from extra slash on windows and trailing forward slash on non-windows
export function cleanPath(file: URL): string {
  let path = fileURLToPath(file);

  // Remove trailing forward slash if present
  path = path.replace(/\/+$/, '');

  if (process.platform !== 'win32') return path;

  // Remove leading forward slash if present
  return path.replace(/^\/+/, '');
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

export function error(message: string) {
  const date = dt.format(new Date());
  console.error(dim(date), red('■'), message);
}

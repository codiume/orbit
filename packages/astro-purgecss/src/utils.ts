import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export function handleWindowsPath(outputPath: string): string {
  if (process.platform !== 'win32') return outputPath;

  if (outputPath.endsWith('\\')) {
    outputPath = outputPath.substring(0, outputPath.length - 1);
  }
  outputPath = outputPath.replaceAll('\\', '/');

  return outputPath;
}

export async function replaceStringInFile(
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

export async function replaceStringInDirectory(
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

import { readFile, unlink, writeFile } from 'node:fs/promises';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { cleanPath, replaceValueInFile, writeCssFile } from './utils';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(() => Promise.resolve()),
  writeFile: vi.fn(() => Promise.resolve()),
  unlink: vi.fn(() => Promise.resolve()),
  readdir: vi.fn(() => Promise.resolve([]))
}));

vi.mock('node:path', () => ({
  dirname: vi.fn(() => '/path/to'),
  basename: vi.fn((file) => file.split('/').pop() as string),
  join: vi.fn((...args) => args.join('/'))
}));

vi.mock('node:crypto', () => ({
  createHash: vi.fn(() => ({
    update: vi.fn().mockReturnThis(),
    digest: vi.fn().mockReturnValue('abcdefg1'.repeat(5))
  }))
}));

describe('writeCssFile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockCss = 'body { color: red; }';
  const mockFile = '/path/to/astro.csjqp06s.css';

  it('should write new file, delete old file', async () => {
    const newFile = '/path/to/astro.abcdefg1.css';

    const processed = await writeCssFile({
      css: mockCss,
      file: mockFile
    });

    expect(writeFile).toHaveBeenCalledWith(newFile, mockCss);
    expect(unlink).toHaveBeenCalledWith(mockFile);
    expect(processed).toEqual([mockFile, newFile]);
  });

  it('should return an array of old and new file names', async () => {
    const result = await writeCssFile({
      css: mockCss,
      file: mockFile
    });
    expect(result).toEqual([mockFile, '/path/to/astro.abcdefg1.css']);
  });
});

describe('cleanPath', () => {
  it('should return the same path for non-windows platforms', () => {
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    const inputPath = new URL('file:///some/unix/path');
    expect(cleanPath(inputPath)).toBe('/some/unix/path');

    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  it('should remove trailing backslash and replace backslashes with forward slashes on windows', () => {
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const inputPath = new URL('file:///C:/Users/test/path/');
    const expectedPath = 'C:/Users/test/path';
    expect(cleanPath(inputPath)).toBe(expectedPath);

    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  it('should replace backslashes with forward slashes on windows without trailing backslash', () => {
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const inputPath = new URL('file:///C:/Users/test/path');
    const expectedPath = 'C:/Users/test/path';
    expect(cleanPath(inputPath)).toBe(expectedPath);

    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });
});

describe('replaceValueInFile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should replace the value in the file', async () => {
    const filePath = '/path/to/file.txt';
    const searchValue = 'oldValue';
    const replaceValue = 'newValue';
    const originalContent = 'This is the oldValue example.';
    const expectedContent = 'This is the newValue example.';

    // Mock the file content
    vi.mocked(readFile).mockResolvedValue(originalContent);

    await replaceValueInFile(filePath, searchValue, replaceValue);

    // Expect the file to be written with the new content
    expect(writeFile).toHaveBeenCalledWith(filePath, expectedContent, 'utf8');
  });

  it('should not modify the file if the search value is not found', async () => {
    const filePath = '/path/to/file.txt';
    const searchValue = 'nonExistingValue';
    const replaceValue = 'newValue';
    const originalContent = 'This is an example.';

    // Mock the file content
    vi.mocked(readFile).mockResolvedValue(originalContent);

    await replaceValueInFile(filePath, searchValue, replaceValue);

    // Expect the file not to be written
    expect(writeFile).not.toHaveBeenCalled();
  });

  it("should log an error if there's an error reading or writing the file", async () => {
    const filePath = '/path/to/file.txt';
    const searchValue = 'oldValue';
    const replaceValue = 'newValue';
    const error = new Error('File operation failed');

    // Mock the file content to throw an error
    vi.mocked(readFile).mockRejectedValue(error);
    vi.spyOn(console, 'error');

    await replaceValueInFile(filePath, searchValue, replaceValue);

    // Expect the error to be logged
    expect(console.error).toHaveBeenCalledWith(
      `Error processing file ${filePath}: ${error}`
    );
  });
});

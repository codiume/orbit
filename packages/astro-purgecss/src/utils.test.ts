import { unlink, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Dirent } from 'node:fs';
import { resolveOutputPath, writeCssFile } from './utils';

describe('resolveOutputPath', () => {
  it('should return the same path for non-windows platforms', () => {
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    const inputPath = '/some/unix/path';
    expect(resolveOutputPath(inputPath)).toBe(inputPath);

    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  it('should remove trailing backslash and replace backslashes with forward slashes on windows', () => {
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const inputPath = 'C:\\Users\\test\\path\\';
    const expectedPath = 'C:/Users/test/path';
    expect(resolveOutputPath(inputPath)).toBe(expectedPath);

    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  it('should replace backslashes with forward slashes on windows without trailing backslash', () => {
    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const inputPath = 'C:\\Users\\test\\path';
    const expectedPath = 'C:/Users/test/path';
    expect(resolveOutputPath(inputPath)).toBe(expectedPath);

    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });
});

const mockCss = 'body { color: red; }';
const mockFile = '/path/to/astro.csjqp06s.css';
const mockOutDir = '/path/to/outdir';

vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn(() => Promise.resolve()),
  unlink: vi.fn(() => Promise.resolve()),
  readdir: vi.fn(() => {
    const mockHtml = new Dirent();
    mockHtml.name = 'index.html';
    return [mockHtml];
  })
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

  it('should return undefined if no file is provided', async () => {
    const result = await writeCssFile({ css: mockCss, outDir: mockOutDir });
    expect(result).toBeUndefined();
  });

  it('should write new file, delete old file', async () => {
    const newFile = '/path/to/astro.abcdefg1.css';

    const processed = await writeCssFile({
      css: mockCss,
      file: mockFile,
      outDir: mockOutDir
    });

    expect(writeFile).toHaveBeenCalledWith(newFile, mockCss);
    expect(unlink).toHaveBeenCalledWith(mockFile);
    expect(dirname).toHaveBeenCalledWith(mockOutDir);
    expect(processed).toBe(newFile);
  });

  it('should return the new file name', async () => {
    const result = await writeCssFile({
      css: mockCss,
      file: mockFile,
      outDir: mockOutDir
    });
    expect(result).toBe('/path/to/astro.abcdefg1.css');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(writeFile).mockImplementation(() =>
      Promise.reject(new Error('Write error'))
    );

    await expect(
      writeCssFile({ css: mockCss, file: mockFile, outDir: mockOutDir })
    ).rejects.toThrow('Write error');
  });
});

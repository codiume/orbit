import { afterEach, describe, expect, it, vi } from 'vitest';

import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { unlink, writeFile } from 'node:fs/promises';

import { generateFileHash, writeCssFile } from './utils';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(() => Promise.resolve()),
  writeFile: vi.fn(() => Promise.resolve()),
  unlink: vi.fn(() => Promise.resolve())
}));

vi.mock('node:fs', () => ({
  existsSync: vi.fn()
}));

describe('generateFileHash', () => {
  it('should generate correct hash for given content', () => {
    const content = 'body { color: red; }';
    const filePath = '/path/to/_astro/styles.abcdef12.css';

    // Manually create expected hash for comparison
    const expectedHash = createHash('sha256')
      .update(content)
      .digest('hex')
      .slice(0, 8);

    const result = generateFileHash(filePath, content);

    // Verify the hash in the generated filename
    expect(result).toBe(`/path/to/_astro/styles.${expectedHash}.css`);
  });

  it('should maintain file path structure while only changing hash', () => {
    const content = 'div { margin: 0; }';
    const filePath = '/complex/path/_astro/component.12345678.css';

    const result = generateFileHash(filePath, content);

    // Verify original path is preserved
    expect(result.startsWith('/complex/path/_astro/component.')).toBe(true);
    expect(result.endsWith('.css')).toBe(true);
  });

  it('should generate different hashes for different content', () => {
    const filePath = '/path/to/_astro/styles.12345678.css';
    const content1 = 'body { color: red; }';
    const content2 = 'body { color: blue; }';

    const result1 = generateFileHash(filePath, content1);
    const result2 = generateFileHash(filePath, content2);

    expect(result1).not.toBe(result2);
  });

  it('should generate same hash for same content', () => {
    const filePath = '/path/to/_astro/styles.12345678.css';
    const content = 'body { color: red; }';

    const result1 = generateFileHash(filePath, content);
    const result2 = generateFileHash(filePath, content);

    expect(result1).toBe(result2);
  });

  it('should handle empty content', () => {
    const filePath = '/path/to/_astro/styles.12345678.css';
    const content = '';

    const result = generateFileHash(filePath, content);

    // Verify structure is maintained even with empty content
    expect(result).toMatch(/^\/path\/to\/_astro\/styles\.[a-f0-9]{8}\.css$/);
  });

  it('should generate exactly 8 character hash', () => {
    const filePath = '/path/to/_astro/styles.12345678.css';
    const content = 'some content';

    const result = generateFileHash(filePath, content);

    // Extract hash from result
    const hash = result.match(/\.([a-f0-9]+)\.css$/)?.[1];
    expect(hash).toHaveLength(8);
  });

  it('should handle filenames with multiple dots', () => {
    const filePath = '/path/to/_astro/styles.min.12345678.css';
    const content = 'body { margin: 0; }';

    const result = generateFileHash(filePath, content);

    // Verify only the hash part is replaced
    expect(result).toMatch(
      /^\/path\/to\/_astro\/styles\.min\.[a-f0-9]{8}\.css$/
    );
  });
});

describe('writeCssFile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockCss = 'body { color: red; }';
  const oldFilePath = '/path/to/_astro/file.old-hash.css';
  const newFilePath = '/path/to/_astro/file.new-hash.css';

  it('should write CSS content to new file and remove old file if different', async () => {
    // Mock existsSync to return true for testing file removal
    vi.mocked(existsSync).mockReturnValue(true);

    await writeCssFile(newFilePath, mockCss, oldFilePath);

    // Verify new file was written
    expect(writeFile).toHaveBeenCalledWith(newFilePath, mockCss, 'utf8');

    // Verify old file was removed
    expect(existsSync).toHaveBeenCalledWith(oldFilePath);
    expect(unlink).toHaveBeenCalledWith(oldFilePath);
  });

  it('should not remove old file if it does not exist', async () => {
    // Mock existsSync to return false
    vi.mocked(existsSync).mockReturnValue(false);

    await writeCssFile(newFilePath, mockCss, oldFilePath);

    // Verify new file was written
    expect(writeFile).toHaveBeenCalledWith(newFilePath, mockCss, 'utf8');

    // Verify old file was checked but not removed
    expect(existsSync).toHaveBeenCalledWith(oldFilePath);
    expect(unlink).not.toHaveBeenCalled();
  });

  it('should not remove old file if paths are identical', async () => {
    // Same path for old and new file
    const filePath = '/path/to/unchanged.css';

    await writeCssFile(filePath, mockCss, filePath);

    // Verify new content was written
    expect(writeFile).toHaveBeenCalledWith(filePath, mockCss, 'utf8');

    // Verify no removal attempt was made
    expect(unlink).not.toHaveBeenCalled();
  });
});

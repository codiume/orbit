import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Shared tsdown settings, tuned to reproduce what tsup used to emit
/** @type {import('tsdown').UserConfig} */
export const baseConfig = {
  outDir: 'dist',
  clean: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  platform: 'node',
  // .js for ESM and .cjs for CJS, as in package.json "exports"
  fixedExtension: false,
  // `node:fs` -> `fs`
  nodeProtocol: 'strip',
  outputOptions: (options, format) =>
    format === 'cjs'
      ? // `'use strict'` and no Symbol.toStringTag marker on `exports`
        {
          ...options,
          strict: true,
          esModule: false,
          generatedCode: { symbols: false }
        }
      : options,
  hooks: {
    /** @param {{ options: { outDir: string } }} ctx */
    async 'build:done'({ options: { outDir } }) {
      const files = await readdir(outDir);
      for (const file of files) {
        const path = join(outDir, file);
        // tsdown drops .d.ts.map files but leaves the comments pointing at them
        if (/\.d\.c?ts$/.test(file)) {
          const code = await readFile(path, 'utf8');
          await writeFile(
            path,
            code.replace(/\n\/\/# sourceMappingURL=\S+$/, '\n')
          );
          continue;
        }
        // Entries that only re-export .astro files have no mappings, so
        // rolldown skips their map; emit the empty one tsup did
        if (/\.c?js$/.test(file) && !files.includes(`${file}.map`)) {
          const code = await readFile(path, 'utf8');
          await writeFile(
            `${path}.map`,
            JSON.stringify({
              version: 3,
              sources: [],
              names: [],
              mappings: '',
              file,
              sourcesContent: []
            })
          );
          await writeFile(path, `${code}//# sourceMappingURL=${file}.map\n`);
        }
      }
    }
  }
};

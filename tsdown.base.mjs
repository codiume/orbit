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
      : options
};

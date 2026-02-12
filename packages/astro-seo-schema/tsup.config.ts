import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/jsonld.ts', 'src/*.astro'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  platform: 'node',
  dts: false,
  loader: {
    '.astro': 'copy'
  }
});

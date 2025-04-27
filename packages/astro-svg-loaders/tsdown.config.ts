import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/loaders/*.astro'],
  format: ['esm'],
  outDir: 'dist',
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  platform: 'node',
  // Workaround: tsdown lacks native Astro file type extraction
  // Alternative type generation methods required (e.g., manual .d.ts files)
  dts: false,
  loader: {
    '.astro': 'copy'
  }
});

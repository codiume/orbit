import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/*.astro'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  clean: true,
  minify: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  platform: 'node',
  // Workaround: tsup lacks native Astro file type extraction
  // Alternative type generation methods required (e.g., manual .d.ts files)
  dts: false,
  loader: {
    '.astro': 'copy'
  }
});

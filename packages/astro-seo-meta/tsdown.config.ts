import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/*.astro'],
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
  // tsdown lacks support for custom loaders loader extraction
  // @see https://github.com/rolldown/tsdown/issues/162#issuecomment-2833715449
  inputOptions: {
    moduleTypes: {
      '.astro': 'asset'
    }
  }
});

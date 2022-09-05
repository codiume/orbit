import { build as esbuild } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';

export const build = async (entryPoints, outdir = 'dist') => {
  await esbuild({
    bundle: false,
    entryPoints: entryPoints,
    format: 'esm',
    minify: false,
    outdir: outdir,
    platform: 'node',
    sourcemap: false,
    sourcesContent: false,
    target: 'node14',
    outExtension: {
      '.js': '.mjs'
    },
    loader: {
      '.astro': 'copy'
    },
    plugins: [
      clean({
        patterns: [`${outdir}/*`]
      })
    ]
  });
};

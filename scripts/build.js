#!/usr/bin/env node
import { build } from "esbuild";
import { copy } from "esbuild-plugin-copy";
import { deleteAsync } from "del";

(async () => {
  await clean("dist");
  await build({
    bundle: false,
    entryPoints: ["src/index.ts","src/jsonld.ts"],
    format: "esm",
    minify: false,
    outdir: "dist",
    outExtension: {},
    platform: "node",
    sourcemap: false,
    sourcesContent: false,
    target: "node14",
    outExtension: {
      ".js": ".mjs",
    },
    plugins: [
      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: "cwd",
        assets: {
          from: ["./src/components/*"],
          to: ["./dist/components/*"],
        },
      }),
    ],
  });

  async function clean(outdir) {
    return deleteAsync([`${outdir}/**`, `!${outdir}/**/*.d.ts`]);
  }
})();

#!/usr/bin/env node
import { build } from "esbuild";
import { clean } from "esbuild-plugin-clean";

(async () => {
  await build({
    bundle: false,
    entryPoints: ["src/index.ts", "src/jsonld.ts", "src/Schema.astro"],
    format: "esm",
    minify: false,
    outdir: "dist",
    platform: "node",
    sourcemap: false,
    sourcesContent: false,
    target: "node14",
    outExtension: {
      ".js": ".mjs",
    },
    loader: {
      ".astro": "copy",
    },
    plugins: [
      clean({
        patterns: ["./dist/*"],
      }),
    ],
  });
})();

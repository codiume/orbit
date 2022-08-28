#!/usr/bin/env node
import { build } from "esbuild";
import { clean } from "esbuild-plugin-clean";
import glob from "tiny-glob";

(async () => {
  const entryPoints = await glob("src/components/*.astro");
  await build({
    bundle: false,
    entryPoints: ["src/index.ts", ...entryPoints],
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

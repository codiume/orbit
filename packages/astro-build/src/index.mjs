#!/usr/bin/env node
import { Command } from 'commander';
import { oraPromise } from 'ora';
import glob from 'tiny-glob';

import { build } from './commands.mjs';

const findEntryPoints = async (paths) => {
  let entryPoints = [];
  for (const path of paths) {
    const files = await glob(path);
    entryPoints = [...entryPoints, ...files];
  }

  return entryPoints;
};

(async function () {
  const program = new Command();

  program
    .requiredOption('-s, --src <files...>', 'specify all src files')
    .option('-d, --outdir [folder]', 'specify a dist folder')
    .parse(process.argv);

  // Getting entry points
  const { src, outdir } = program.opts();
  const entryPoints = await findEntryPoints(src);

  // Building files using esbuild
  await oraPromise(build(entryPoints, outdir), {
    text: 'Building entrypoints',
    successText: 'Completed',
  });
})();

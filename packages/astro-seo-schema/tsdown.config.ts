import { defineConfig } from 'tsdown';
import { baseConfig } from '../../tsdown.base.mjs';

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts', 'src/jsonld.ts'],
  format: ['esm'],
  // Types for .astro components are emitted by tsc (see check-types)
  dts: false,
  // Keep .astro imports as-is and ship the component sources unchanged
  deps: { neverBundle: [/\.astro$/] },
  copy: [{ from: 'src/*.astro', to: 'dist' }]
});

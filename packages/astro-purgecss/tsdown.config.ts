import { defineConfig } from 'tsdown';
import { baseConfig } from '../../tsdown.base.mjs';

export default defineConfig({
  ...baseConfig,
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // kleur is a dev-only dependency inlined into the bundle
  deps: { onlyBundle: ['kleur'] },
  dts: true
});

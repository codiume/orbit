import type { AstroIntegration } from 'astro';

function AstroWebhooks(options= {}): AstroIntegration {
  return {
    name: 'astro-webhooks',
    hooks: {
      'astro:build:done': async () => console.log("done")
    }
  };
}

export default AstroWebhooks;

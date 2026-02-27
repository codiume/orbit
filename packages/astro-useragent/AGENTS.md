# AGENTS.md

## Install

```bash
pnpm install astro-useragent
```

Or:

```bash
npm install astro-useragent
```

## Client-Side Usage

```astro
<script type="module">
  import { useUserAgent } from 'astro-useragent';

  const { source, isMobile, browser } = useUserAgent(navigator.userAgent);
</script>
```

## SSR Usage

Enable SSR in `astro.config.mjs`:

```javascript
export default {
  output: 'server'
};
```

Use in Astro pages:

```astro
---
import { useUserAgent } from 'astro-useragent';

const uaString = Astro.request.headers.get('user-agent') ?? '';
const { source, isMobile } = useUserAgent(uaString);
---
```

Use in API routes:

```typescript
import { useUserAgent } from 'astro-useragent';

export async function get({ request }) {
  const uaString = request.headers.get('user-agent');
  const { isMobile } = useUserAgent(uaString);

  if (isMobile) {
    return Response.redirect('https://mobile.site.com/', 307);
  }
}
```

## Parsed Properties

Returns object with:

- `source` - Original UA string
- `browser` - Browser name
- `isMobile` - Boolean
- `isDesktop` - Boolean
- `isTablet` - Boolean
- `isAndroid` - Boolean
- `isIos` - Boolean
- `isChrome` - Boolean
- `isFirefox` - Boolean
- `isSafari` - Boolean
- `isEdge` - Boolean
- `os` - OS name
- `deviceType` - Device type

## Build

No build step required. Package exports utility function.

## Test

Verify parsing returns correct values for known user agents.

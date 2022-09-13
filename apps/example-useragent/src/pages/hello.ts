import type { APIContext } from 'astro';
import { useUserAgent } from 'astro-useragent';

export async function get({ request }: APIContext) {
  const uaString = request.headers.get('user-agent');
  const { isMobile } = useUserAgent(uaString);

  if (isMobile) {
    return Response.redirect('mobile.example.com', 307);
  }

  const greetings = {
    message: 'hello from astro API'
  };

  return new Response(JSON.stringify(greetings), {
    status: 200
  });
}

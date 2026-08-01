import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

/**
 * robots.txt sa generuje, nie kopíruje — odkaz na sitemap tak vždy sedí
 * s doménou nastavenou v `site.ts` a nemôže zostať zabudnutý na starej.
 */
export const GET: APIRoute = () =>
  new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('sitemap-index.xml', SITE.url).href}`, ''].join(
      '\n',
    ),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );

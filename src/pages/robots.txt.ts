import type { APIRoute } from 'astro';
import { isProductionDeploy } from '../lib/url';

/**
 * robots.txt sa generuje, nie kopíruje — odkaz na sitemap tak vždy sedí
 * s adresou, na ktorú sa práve buildovalo, a nemôže zostať na starej doméne.
 *
 * Na testovacom nasadení je web zámerne zakázaný pre vyhľadávače: dve verzie
 * toho istého obsahu v indexe by si navzájom konkurovali.
 */
export const GET: APIRoute = ({ site }) => {
  const home = new URL(import.meta.env.BASE_URL, site);

  const body = isProductionDeploy()
    ? ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('sitemap-index.xml', home).href}`, '']
    : ['# Testovacie nasadenie — neindexovať.', 'User-agent: *', 'Disallow: /', ''];

  return new Response(body.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

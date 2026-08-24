// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/data/site.ts';

/**
 * Adresa a podadresár sa dajú prebiť premennými prostredia, aby ten istý kód
 * fungoval na testovacích GitHub Pages (web beží v podadresári) aj na ostrej
 * doméne (web beží v koreni) bez editovania súborov.
 *
 *   testovací build:  SITE_URL=https://todevelopers.github.io \
 *                     BASE_PATH=/webdev-constuct-comp npm run build
 *   ostrý build:      npm run build          (vezme hodnoty zo src/data/site.ts)
 */
const site = process.env.SITE_URL || SITE.url;
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  // `site` je povinné pre sitemap.xml, kanonické URL a absolútne OG obrázky.
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap({ lastmod: new Date() })],
  build: {
    // CSS necháme inline až do 4 kB — ušetrí to request na malých stránkach.
    inlineStylesheets: 'auto',
  },
  image: {
    // Reálne fotky zo stavby sú fotografie, nie grafika → AVIF/WebP dávajú
    // najväčšiu úsporu. Astro generuje varianty pri builde, nie za behu.
    responsiveStyles: true,
    layout: 'constrained',
  },
  vite: {
    build: {
      // Deterministické názvy assetov uľahčujú dlhé cache hlavičky na hostingu.
      assetsInlineLimit: 2048,
    },
  },
});

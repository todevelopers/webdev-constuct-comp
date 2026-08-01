// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/data/site.ts';

export default defineConfig({
  // `site` je povinné pre sitemap.xml, kanonické URL a absolútne OG obrázky.
  site: SITE.url,
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

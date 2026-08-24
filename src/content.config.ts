import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Astro 7 už `z` z 'astro:content' nere-exportuje ako odporúčanú cestu —
// zod sa importuje priamo a je uvedený medzi závislosťami projektu.
import { z } from 'zod';

/**
 * Realizácie = obsahová kolekcia.
 *
 * Pridanie novej realizácie znamená pridať JEDEN .md súbor do
 * `src/content/projects/`. Nič iné sa needituje — kategórie do filtra,
 * detailné stránky, sitemap aj JSON-LD sa z týchto súborov odvodia samy.
 *
 * Schéma je vynútená cez zod: keď zákazník zabudne vyplniť pole alebo
 * preklepne kategóriu, build spadne s presnou hláškou namiesto toho, aby sa
 * chyba potichu dostala na produkciu.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(3),
      /** Zoznam kategórií je uzavretý — filter v galérii sa z nich generuje. */
      category: z.enum([
        'Hrubá stavba',
        'Rekonštrukcia',
        'Fasáda',
        'Kúpeľne a obklady',
        'Interiér',
      ]),
      year: z.number().int().min(2000).max(2100),
      place: z.string(),
      /** Napr. „186 m²“ — voľný text, lebo raz je to plocha a inokedy dĺžka. */
      area: z.string(),
      /** Perex do karty aj do meta description detailu. Drž do ~160 znakov. */
      summary: z.string().min(20).max(300),

      // `image()` overí, že súbor existuje, a pustí ho cez optimalizáciu
      // (AVIF/WebP, viacero veľkostí, rozmery do HTML proti CLS).
      cover: image(),
      gallery: z.array(image()).default([]),

      /** Odrážky „čo sme robili“. */
      scope: z.array(z.string()).default([]),
      /** Tabuľka parametrov v detaile. */
      specs: z.array(z.object({ k: z.string(), v: z.string() })).default([]),

      /** Väčšia dlaždica v mriežke — vhodné pre 1–2 vlajkové realizácie. */
      wide: z.boolean().default(false),
      /** Nižšie číslo = vyššie v poradí. Rovnaké čísla sa zoradia podľa roku. */
      order: z.number().default(100),
      /** Rozpracovaná realizácia — nevykreslí sa a nedostane sa do sitemap. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };

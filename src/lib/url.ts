/**
 * Zostavovanie interných odkazov.
 *
 * Web musí fungovať na dvoch miestach naraz:
 *   • testovacie GitHub Pages v podadresári  → /webdev-constuct-comp/...
 *   • ostrá doména v koreni                  → /...
 *
 * Preto sa interné odkazy nikdy nepíšu natvrdo ako "/realizacie/",
 * ale prechádzajú cez `withBase()`. Prefix drží Astro v `import.meta.env.BASE_URL`
 * a nastavuje sa jedným premenným prostredia pri builde (viď astro.config.mjs).
 */
export function withBase(path: string): string {
  // Čistá kotva (#kontakt) sa vzťahuje na aktuálnu stránku — prefix by ju rozbil.
  if (path.startsWith('#')) return path;

  // Externé odkazy a protokoly nechávame tak, ako sú.
  if (/^[a-z][a-z0-9+.-]*:/i.test(path) || path.startsWith('//')) return path;

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : `/${path}`);
}

/**
 * Beží tento build na ostrej doméne, alebo je to testovacie nasadenie?
 *
 * Rozlišujeme podľa podadresára: ostrý web beží v koreni domény, testovacie
 * GitHub Pages v podadresári. Testovacia verzia sa potom sama vylúči z
 * vyhľadávačov, aby nekonkurovala ostrej v indexe.
 */
export function isProductionDeploy(): boolean {
  return import.meta.env.BASE_URL === '/';
}

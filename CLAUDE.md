# CLAUDE.md

Kontext pre agenta. Návod pre človeka je v `README.md` — **neduplikuj ho sem**;
keď sa obsah rozíde, jeden z nich začne klamať.

Majiteľ repa nie je webový vývojár. Vysvetľuj rozhodnutia po slovensky a bez
žargónu, alebo žargón hneď vysvetli. Komentáre v kóde píš tiež po slovensky —
zvyšok repa je tak písaný.

## Čo to je

Statický web stavebnej firmy. Astro 7, výstup je čisté HTML + CSS.
Vznikol prepisom exportu z návrhového nástroja (React runtime `support.js`,
ktorý sa spúšťal u návštevníka). Pôvodný export je v histórii po commit `9ef3d85`.

## Príkazy

```bash
npm run dev      # vývojový server
npm run build    # produkčný build do dist/
npm run check    # typová kontrola — MUSÍ prejsť pred commitom
```

**Pred každým commitom spusti `npm run check` aj `npm run build`.** Obidva musia
skončiť s 0 chybami. Schéma obsahu je vynútená pri builde, takže build je
zároveň kontrola dát.

## Pravidlá, ktoré sa nesmú porušiť

**Žiadny frontend framework v prehliadači.** Celý zmysel prepisu bol dostať React
preč. Nepridávaj React/Vue/Svelte islands, nepridávaj skripty z CDN. JavaScript
na stránke je len progresívne vylepšenie — web musí fungovať aj bez neho.
Keď pridávaš interaktivitu, over ju s vypnutým JS.

**Interné odkazy vždy cez `withBase()`** zo `src/lib/url.ts`. Nikdy nepíš
`href="/realizacie/"` natvrdo. Web beží aj v podadresári (testovacie GitHub
Pages) a natvrdo písaný odkaz tam padne na 404. Čisté kotvy (`#kontakt`) sú
výnimka a `withBase()` ich sám nechá tak.

**Obrázky patria do `src/assets/`, nie do `public/`.** Len tak prejdú cez
`astro:assets` (AVIF/WebP, viac veľkostí, rozmery v HTML proti CLS).
V `public/` skončia neoptimalizované.

**Fonty len self-hostované z `@fontsource`.** Nepridávaj Google Fonts CDN —
build musí zostať offline-deterministický a IP návštevníka nesmie odchádzať
Googlu (GDPR). Každý font-weight stojí ~36 kB (latin + latin-ext), takže pred
pridaním rezu over, že sa naozaj používa. Slovenská diakritika potrebuje
`latin-ext`.

**`src/data/site.ts` je jediný zdroj pravdy o firme.** Kontakty, IČO, doména.
Tie isté hodnoty idú do JSON-LD. Nikdy needituj tú istú informáciu na dvoch
miestach.

**Nesťahuj stock fotky do repa.** Placeholdery generuje
`scripts/make-placeholders.mjs` lokálne — v repe zámerne nie je cudzí
licencovaný obsah.

## Kde je čo

| Chcem zmeniť | Súbor |
| --- | --- |
| kontakty, IČO, doména, endpoint formulára | `src/data/site.ts` |
| služby, fakty o firme | `src/data/services.ts` |
| realizácie | `src/content/projects/*.md` (jeden súbor = jedna realizácia) |
| schému realizácií, kategórie | `src/content.config.ts` |
| farby, typografiu, rozstupy | `src/styles/tokens.css` |
| `<head>`, SEO, Open Graph | `src/layouts/BaseLayout.astro` |

Štýly komponentov patria do ich vlastného `<style>` bloku (Astro ich scopuje).
Do `global.css` pridávaj len to, čo naozaj zdieľajú aspoň dva komponenty.

## Dva režimy nasadenia

Adresa a podadresár sa riadia premennými prostredia, v súboroch sa nič needituje:

```bash
npm run build                                                     # ostrý, v koreni
SITE_URL=https://todevelopers.github.io BASE_PATH=/webdev-constuct-comp npm run build
```

Testovacie nasadenie (`BASE_PATH` nastavené) sa samo vylučuje z vyhľadávačov —
`Disallow: /` v robots.txt plus `noindex`. Rozlišuje to `isProductionDeploy()`
v `src/lib/url.ts`. Túto logiku nerozbi: dve verzie webu v Google indexe by si
konkurovali.

## Overovanie zmien v prehliadači

Chromium je predinštalované, `playwright` NIE je v závislostiach projektu
(zámerne — je to nástroj, nie závislosť webu). Doinštaluj ho bez zápisu do
package.json a pomocný skript maj v koreni projektu, inak sa `playwright`
nevyrieši:

```bash
npm install --no-save playwright
# skript musí byť v koreni repa (napr. ./.check.mjs), nie v /tmp
node ./.check.mjs   # chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })
rm -f ./.check.mjs  # po overení uprac
```

Pri zmene rozloženia over vždy desktop aj mobil (390 px) a stav s vypnutým
JavaScriptom.

## Obmedzenia prostredia

Sieťová politika blokuje `images.unsplash.com`, `fonts.googleapis.com`
a `fonts.gstatic.com` (403 z proxy). npm registry je dostupný. Preto sú fonty
z npm a placeholdery generované lokálne — nesnaž sa to obísť.

## Git

Vetva: `claude/css-support-js-compilation-yzi7gi`. Commit správy po slovensky,
vysvetľujúce **prečo**, nielen čo. PR zakladaj len na výslovnú požiadavku.

# Stavbex — web stavebnej firmy

Statický web postavený na [Astro](https://astro.build). Výstupom buildu je
čisté HTML, CSS a obrázky — **žiadny frontend framework sa v prehliadači
nespúšťa**. Celý JavaScript na stránke má pod 3 kB a je len progresívnym
vylepšením: bez neho web funguje ďalej.

```bash
npm install
npm run dev      # vývojový server na http://localhost:4321
npm run build    # produkčný build do dist/
npm run preview  # lokálne overenie produkčného buildu
npm run check    # typová kontrola (.astro + .ts)
```

> Tento súbor je návod pre človeka. Pravidlá a pasce projektu pre AI agenta sú
> v `CLAUDE.md` — zámerne obsahuje niečo iné, nie to isté inými slovami.

---

## Čo kde je

```
src/
├── data/                    ← fakty o firme (TypeScript, kontrolované typmi)
│   ├── site.ts              ← názov, kontakty, IČO, doména, endpoint formulára
│   └── services.ts          ← služby, fakty o firme, body pri cenovej ponuke
├── content/projects/        ← REALIZÁCIE: jeden .md súbor = jedna realizácia
├── content.config.ts        ← schéma realizácií (zod) — vynútená pri builde
├── assets/                  ← obrázky, ktoré prechádzajú optimalizáciou
├── styles/
│   ├── tokens.css           ← farby, typografia, rozstupy — vzhľad sa mení TU
│   └── global.css           ← reset, základná typografia, zdieľané primitívy
├── components/              ← stavebné bloky stránky (štýly sú v nich scoped)
├── layouts/BaseLayout.astro ← <head>, SEO, Open Graph — jediné miesto
└── pages/
    ├── index.astro          ← domovská stránka
    ├── realizacie/[...slug].astro  ← detail realizácie (vlastná URL)
    ├── dakujeme.astro       ← potvrdenie po odoslaní formulára
    ├── 404.astro
    └── robots.txt.ts        ← generuje sa, aby odkaz na sitemap vždy sedel
```

---

## Bežné úpravy

### Zmeniť telefón, e-mail, adresu, IČO

Jediný súbor: **`src/data/site.ts`**. Hodnoty sa premietnu do hlavičky,
kontaktu, pätičky aj do štruktúrovaných dát pre Google — nikde inde sa
neopakujú.

> Adresa a telefón musia byť zapísané **rovnako** ako na Google Business
> Profile a v obchodnom registri. Nekonzistencia (tzv. NAP) zhoršuje pozíciu
> v lokálnom vyhľadávaní.

### Pridať realizáciu

1. Vlož fotky do `src/assets/projects/` s názvom `<slug>-01.jpg`, `-02.jpg`, …
2. Vytvor `src/content/projects/<slug>.md`:

```yaml
---
title: Rekonštrukcia bytu Ružinov
category: Rekonštrukcia        # musí byť z povoleného zoznamu (viď nižšie)
year: 2026
place: Bratislava – Ružinov
area: 68 m²
summary: >-
  Jedna až dve vety do karty aj do popisu pre Google. Drž do ~160 znakov.
cover: ../../assets/projects/rekonstrukcia-bytu-ruzinov-01.jpg
gallery:
  - ../../assets/projects/rekonstrukcia-bytu-ruzinov-02.jpg
scope:
  - Búracie práce
  - Nové rozvody
specs:
  - { k: Rozsah, v: Rekonštrukcia na kľúč }
  - { k: Doba realizácie, v: 9 týždňov }
wide: false                    # true = dvojnásobne široká dlaždica v galérii
order: 15                      # nižšie číslo = vyššie v poradí
draft: false                   # true = nezverejní sa
---

Voľný text pod čiarou. Sem patrí príbeh realizácie — čo bolo zadanie, čo bolo
náročné, ako ste to vyriešili. Práve tento text číta Google.
```

Názov súboru je zároveň URL: `<slug>.md` → `/realizacie/<slug>/`.
Stránka detailu, filter kategórií aj sitemap sa vytvoria samy.

**Povolené kategórie** (`src/content.config.ts`): Hrubá stavba ·
Rekonštrukcia · Fasáda · Kúpeľne a obklady · Interiér. Pridanie novej znamená
doplniť ju do `z.enum([...])` — schéma je zámerne uzavretá, aby preklep
nevytvoril tichú novú kategóriu vo filtri.

Ak niečo vo frontmatteri chýba alebo nesedí, **build spadne s presnou
hláškou**. Chyba sa tak nikdy nedostane na produkciu.

### Zmeniť farby

`src/styles/tokens.css`, hodnota `--accent-h` (odtieň 0–360). Zmenou jedného
čísla sa prefarbí celý web a zachová sa kontrast, lebo svetlosť ostáva:

| odtieň | `--accent-h` |
| ------ | ------------ |
| oranžová (aktuálna) | `55` |
| modrá | `250` |
| zelená | `162` |
| limetka | `125` |
| bordó | `14` |

### Napojiť kontaktný formulár

Formulár je obyčajný `<form method="post">` a funguje aj bez JavaScriptu.
Kým nie je nastavený endpoint, **na stránke sa zobrazí upozornenie** — radšej
viditeľná hláška než ticho zahodený dopyt.

V `src/data/site.ts`, objekt `FORM`:

- **Formspree / Web3Forms / Formcarry** → vlož ich URL do `action`
- **Netlify Forms** → nastav `provider: 'netlify'` (pole `action` nechaj prázdne)
- **vlastný backend** → vlož vlastnú URL do `action`

Ochrana proti spamu je bez CAPTCHA: skryté honeypot pole a časová pečiatka
načítania. Obidve vyhodnocuje príjemca — nastav si u neho pravidlo, že dopyt
s vyplneným `firma_www` alebo odoslaný do 3 sekúnd sa zahodí.

---

## Rozhodnutia, ktoré stoja za vysvetlenie

**Realizácie majú vlastné URL, nie modálne okno.** Pôvodný prototyp otváral
detail v prekrytí. Samostatná stránka sa dá poslať v správe, otvoriť na novej
karte a hlavne — Google ju zaindexuje. Dopyty typu „rekonštrukcia bytu
Petržalka“ sú presne to, čo stavebnej firme privádza zákazníkov.

**Fonty sú self-hostované z npm** (`@fontsource/*`), nie z Google Fonts CDN.
Build je vďaka tomu deterministický a funguje offline, stránka nemá externý
bod zlyhania a do Googlu neodchádza IP adresa návštevníka (GDPR).

**Mapa sa načíta až na kliknutie.** Vložený Google iframe posiela dáta
návštevníka Googlu ešte pred akýmkoľvek súhlasom a stojí stovky kB. Kým
používateľ neklikne, je na mieste mapy odkaz do Google Máp.

**Hero je obrázok, nie video.** Hero je LCP prvok — video ho zdržiava o stovky
milisekúnd na tom najdôležitejšom mieste stránky.

**Filter realizácií je progresívne vylepšenie.** Lišta filtrov je v HTML
skrytá a odkrýva ju až skript. Bez JavaScriptu používateľ nikdy neuvidí
tlačidlá, ktoré nič nerobia — uvidí všetky realizácie.

**Obrázky prechádzajú `astro:assets`.** Pri builde vzniknú AVIF/WebP varianty
vo viacerých veľkostiach a do HTML sa zapíšu rozmery, takže sa rozloženie
počas načítania nehýbe (CLS). Preto obrázky patria do `src/assets/`, nie do
`public/` — tam by sa skopírovali bez optimalizácie.

---

## Placeholder obrázky

Obrázky v `src/assets/` sú **vygenerované placeholdery**, nie fotografie.
Zámerne v repozitári nie je žiadny cudzí licencovaný obsah.

Nahradenie: skopíruj reálne fotky pod rovnakými názvami. Odporúčaná šírka
aspoň 1600 px (hero 2000 px), formát JPG — konverziu do AVIF/WebP a zmenšenie
spraví build sám.

Po dodaní reálnych fotiek môžeš zmazať `scripts/make-placeholders.mjs`.

---

## Pred spustením na ostro

- [ ] `SITE.url` v `src/data/site.ts` = reálna doména (inak budú zlé kanonické URL)
- [ ] Skontrolovať kontakty, IČO, DIČ a otváracie hodiny
- [ ] Napojiť formulár (`FORM.action`) a **otestovať reálnym odoslaním**
- [ ] Nahradiť placeholder fotky reálnymi realizáciami
- [ ] Doplniť `SOCIAL` odkazy, ak firma má profily
- [ ] Overiť čísla v `STATS` a `FACTS` — sú to tvrdenia o firme
- [ ] Zaregistrovať doménu v Google Search Console a poslať `sitemap-index.xml`
- [ ] Nastaviť Google Business Profile s rovnakou adresou a telefónom

## Nasadenie

`npm run build` vytvorí adresár `dist/` — statické súbory, ktoré obslúži
akýkoľvek hosting (Netlify, Vercel, Cloudflare Pages, GitHub Pages aj obyčajný
FTP na shared hosting). Nie je potrebný Node na strane servera.

### Dva režimy: testovací a ostrý

Web musí fungovať na dvoch miestach naraz — na testovacích GitHub Pages
(v podadresári podľa názvu repozitára) aj na ostrej doméne (v koreni). Rieši
to dvojica premenných prostredia; **v súboroch sa pri prepínaní nič needituje**:

```bash
# ostrý build — vezme doménu zo src/data/site.ts
npm run build

# testovací build do podadresára
SITE_URL=https://todevelopers.github.io BASE_PATH=/webdev-constuct-comp npm run build
```

Preto sa interné odkazy **nikdy nepíšu natvrdo** ako `href="/realizacie/"`, ale
cez pomocník `withBase()` zo `src/lib/url.ts`. Bez neho by na testovacej adrese
ukazovali do koreňa domény a padali na 404.

Testovacie nasadenie sa navyše samo vylúči z vyhľadávačov (`Disallow: /`
v robots.txt plus `noindex` v hlavičke), aby v Google nekonkurovalo ostrému
webu duplicitným obsahom. Rozpoznáva sa podľa toho, či web beží v podadresári.

### GitHub Pages

Workflow `.github/workflows/deploy-pages.yml` pri každom pushi do `main`
spustí build a nasadí `dist/`. Jednorazovo treba v repozitári zapnúť:

**Settings → Pages → Source: GitHub Actions**

(Nie „Deploy from a branch“ — ten by servíroval zdrojáky projektu, nie
zostavený web, a skončil by na 404.)

**Nasadzuje sa len z `main`.** Prostredie `github-pages` má v predvolenom
nastavení GitHubu ochranné pravidlo, ktoré púšťa nasadenie iba z predvolenej
vetvy — vývojová vetva sa zbuildí, ale deploy jej GitHub odmietne s hláškou
*„is not allowed to deploy to github-pages due to environment protection
rules“*. Nie je to chyba projektu.

Ak by si chcel nasadzovať aj z vývojovej vetvy, povoľ ju v
**Settings → Environments → github-pages → Deployment branches** a dopíš ju
do `branches` vo workflow.

### Prechod na ostrú doménu

1. Nastav reálnu doménu do `SITE.url` v `src/data/site.ts`
2. Buduj bez `BASE_PATH` — web pobeží v koreni, `noindex` zmizne sám

/**
 * Služby firmy.
 *
 * `slug` je zároveň hodnota v rozbaľovacom zozname kontaktného formulára —
 * vďaka tomu vieš z dopytu presne, o akú prácu ide, bez duplicitného zoznamu.
 */
export interface Service {
  slug: string;
  num: string;
  title: string;
  text: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'hruba-stavba',
    num: '01',
    title: 'Hrubé stavby a murárske práce',
    text: 'Základy, murivo, stropy, preklady a krov. Preberáme stavbu od výkopu po strechu s jedným zodpovedným stavbyvedúcim.',
  },
  {
    slug: 'rekonstrukcia',
    num: '02',
    title: 'Rekonštrukcie bytov a domov',
    text: 'Búracie práce, nové rozvody, podlahy a finálne povrchy. Byt odovzdávame obývateľný a upratený.',
  },
  {
    slug: 'fasada',
    num: '03',
    title: 'Fasády a zatepľovanie',
    text: 'Systémy ETICS, obnova balkónov a klampiarske prvky. Realizujeme aj bytové domy z lešenia počas obývanosti.',
  },
  {
    slug: 'interier',
    num: '04',
    title: 'Interiéry a sadrokartón',
    text: 'Priečky, akustické a kazetové podhľady, stierky a maľby vrátane prípravy pre elektro a vzduchotechniku.',
  },
  {
    slug: 'kupelne',
    num: '05',
    title: 'Kúpeľne, obklady a dlažby',
    text: 'Veľkoformátové obklady podľa kladačského plánu, murované sprchy so spádom a podlahové vykurovanie.',
  },
  {
    slug: 'rozpocet',
    num: '06',
    title: 'Cenová ponuka a rozpočet',
    text: 'Ponuku dostanete rozpísanú po položkách s mernými jednotkami a harmonogramom pred podpisom zmluvy.',
  },
];

/** Fakty v sekcii „O nás“. */
export const FACTS: { k: string; v: string }[] = [
  { k: 'Založená', v: '2008, Bratislava' },
  { k: 'Vlastné partie', v: '6 (murári, obkladači, SDK)' },
  { k: 'Pôsobnosť', v: 'Bratislava a okolie do 60 km' },
  { k: 'Záruka', v: '5 rokov na vykonané dielo' },
];

/** Body dôvery pri formulári cenovej ponuky. */
export const QUOTE_PROMISES: string[] = [
  'Obhliadka a ponuka sú bezplatné',
  'Cena platí 30 dní od vystavenia',
  'Bez skrytých položiek a príplatkov',
];

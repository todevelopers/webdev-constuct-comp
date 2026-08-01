/**
 * Jediný zdroj pravdy o firme.
 *
 * Všetko, čo sa mení pri nasadení pre reálneho zákazníka (názov, kontakty,
 * IČO, doména, endpoint formulára), je tu — nie roztrúsené po šablónach.
 * Hodnoty sa zároveň premietajú do JSON-LD pre Google, takže adresa a telefón
 * musia byť presné a zapísané rovnako ako v obchodnom registri a na Google
 * Business Profile (tzv. NAP konzistencia — vplýva na lokálne SEO).
 */

export const SITE = {
  /** Bez lomítka na konci. Musí sedieť s reálnou doménou, inak budú zlé kanonické URL. */
  url: 'https://www.stavbex.sk',
  name: 'Stavbex s.r.o.',
  shortName: 'Stavbex',
  /** Zobrazuje sa v <title> za názvom stránky. */
  tagline: 'Stavebná firma Bratislava',
  description:
    'Hrubé stavby, kompletné rekonštrukcie bytov a domov, fasády a zatepľovanie ' +
    'v Bratislave a okolí. Vlastné murárske partie, cenová ponuka rozpísaná po ' +
    'položkách a harmonogram pred podpisom zmluvy.',
  locale: 'sk_SK',
  lang: 'sk',
  /** Rok založenia — používa sa v JSON-LD aj v pätičke. */
  founded: 2008,
} as const;

export const CONTACT = {
  phone: '+421 903 118 240',
  /** Formát pre href="tel:" — bez medzier a s predvoľbou. */
  phoneHref: '+421903118240',
  email: 'info@stavbex.sk',
  address: {
    street: 'Priemyselná 14',
    postalCode: '821 09',
    city: 'Bratislava',
    country: 'SK',
    countryName: 'Slovensko',
  },
  /** Súradnice sídla — pre JSON-LD a odkaz na mapu. */
  geo: { lat: 48.1553, lng: 17.1465 },
  ico: '45 812 337',
  dic: '2023114892',
  /** Nechaj prázdne, ak firma nie je platiteľ DPH. */
  icDph: '',
  openingHours: [
    { days: 'Pondelok – piatok', hours: '7:00 – 17:00' },
    { days: 'Sobota', hours: 'po dohode' },
  ],
  /** Strojovo čitateľná podoba toho istého — do JSON-LD. */
  openingHoursSpec: [{ days: ['Mo', 'Tu', 'We', 'Th', 'Fr'], opens: '07:00', closes: '17:00' }],
  serviceArea: 'Bratislava a okolie do 60 km',
} as const;

/**
 * Kam odosiela kontaktný formulár.
 *
 * Formulár je zámerne obyčajný HTML `<form method="post">` — funguje aj bez
 * JavaScriptu. Stačí sem doplniť endpoint podľa toho, kde web beží:
 *   • Formspree / Formcarry / Web3Forms → vlož ich URL
 *   • Netlify Forms → nastav `provider: 'netlify'`
 *   • vlastný backend → vlož vlastnú URL
 *
 * Kým je `action` prázdne, formulár sa vykreslí v nastavovacom režime a
 * upozorní, že ešte nie je napojený (radšej viditeľná hláška než ticho
 * zahodená dopytová správa).
 */
export const FORM = {
  provider: 'endpoint' as 'endpoint' | 'netlify',
  action: '',
  /** Stránka, na ktorú sa presmeruje po úspešnom odoslaní. */
  successPath: '/dakujeme/',
  /** Názov skrytého poľa proti spamu (honeypot). Boti ho vyplnia, ľudia nie. */
  honeypotField: 'firma_www',
} as const;

/** Sociálne siete a profily — prázdne položky sa nevykreslia. */
export const SOCIAL = {
  facebook: '',
  instagram: '',
  googleBusiness: '',
} as const;

/** Odkaz na mapu v pätičke/kontakte (bez vloženého iframu — viď Contact.astro). */
export const MAP_LINK =
  `https://www.google.com/maps/search/?api=1&query=` +
  encodeURIComponent(
    `${CONTACT.address.street}, ${CONTACT.address.postalCode} ${CONTACT.address.city}`,
  );

/** Hlavná navigácia. Poradie tu = poradie v hlavičke aj v mobilnom menu. */
export const NAV = [
  { href: '/#realizacie', label: 'Realizácie' },
  { href: '/#sluzby', label: 'Služby' },
  { href: '/#onas', label: 'O nás' },
  { href: '/#kontakt', label: 'Kontakt' },
] as const;

/** Čísla v hero sekcii. Drž ich pravdivé — sú to tvrdenia o firme. */
export const STATS = [
  { value: '18', label: 'rokov na trhu' },
  { value: '240+', label: 'realizácií' },
  { value: '6', label: 'vlastných partií' },
  { value: '5 r.', label: 'záruka na dielo' },
] as const;

/**
 * Vygeneruje neutrálne placeholder obrázky do src/assets/.
 *
 * Zámerne NEsťahuje stock fotky — v repe tak nie je žiadny cudzí licencovaný
 * obsah a na prvý pohľad je jasné, ktoré obrázky ešte treba vymeniť.
 *
 * Spustenie:  node scripts/make-placeholders.mjs
 * Po dodaní reálnych fotiek môžeš tento súbor pokojne zmazať.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Odtiene sú len na to, aby sa dlaždice v mriežke od seba odlíšili. */
const TONES = [
  ['#2b2724', '#4a423b'],
  ['#26292b', '#3f4750'],
  ['#2f2a26', '#54473c'],
  ['#242a28', '#3c4a44'],
  ['#2a2724', '#4b443c'],
  ['#282522', '#463d36'],
];

function svg(w, h, [dark, light], seed) {
  const step = Math.round(w / 14);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="${light}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <pattern id="p" width="${step}" height="${step}" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <rect width="${step}" height="${step}" fill="none"/>
      <rect width="${step / 2}" height="${step}" fill="#ffffff" opacity="0.028"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#p)"/>
  <g fill="none" stroke="#ffffff" stroke-opacity="0.16" stroke-width="${Math.max(2, w / 500)}">
    <rect x="${w * 0.5 - w * 0.07}" y="${h * 0.5 - w * 0.07}" width="${w * 0.14}" height="${w * 0.14}"/>
    <path d="M${w * 0.5 - w * 0.07} ${h * 0.5 + w * 0.07} L${w * 0.5 + w * 0.07} ${h * 0.5 - w * 0.07}"/>
  </g>
  <g fill="#ffffff" fill-opacity="0.2">
    ${Array.from({ length: seed % 3 + 1 }, (_, i) =>
      `<rect x="${w * 0.08}" y="${h - h * 0.12 - i * (h * 0.05)}" width="${w * (0.1 + i * 0.05)}" height="${h * 0.012}"/>`,
    ).join('\n    ')}
  </g>
</svg>`;
}

async function emit(relPath, w, h, tone, seed) {
  const out = resolve(root, relPath);
  await mkdir(dirname(out), { recursive: true });
  const buf = await sharp(Buffer.from(svg(w, h, TONES[tone % TONES.length], seed)))
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
  await writeFile(out, buf);
  console.log(`${relPath}  ${(buf.length / 1024).toFixed(0)} kB`);
}

const SLUGS = [
  'rodinny-dom-zahorska-bystrica',
  'rekonstrukcia-bytu-petrzalka',
  'zateplovanie-bytoveho-domu-ruzinov',
  'kupelne-vila-devin',
  'interier-kancelarie-nivy',
  'pristavba-terasa-dunajska-luzna',
];

for (const [i, slug] of SLUGS.entries()) {
  for (let n = 1; n <= 3; n++) {
    await emit(`src/assets/projects/${slug}-0${n}.jpg`, 1600, 1067, i, i + n);
  }
}

await emit('src/assets/site/hero.jpg', 2000, 1250, 0, 1);
await emit('src/assets/site/onas-01.jpg', 1600, 1067, 2, 2);
await emit('src/assets/site/onas-02.jpg', 1200, 900, 4, 3);
await emit('src/assets/site/onas-03.jpg', 1200, 900, 1, 1);
await emit('src/assets/site/og-default.jpg', 1200, 630, 0, 2);

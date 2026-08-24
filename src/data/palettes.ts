/**
 * Palety farebného akcentu pre prepínač vzhľadu (ozubené koliesko vpravo dole).
 *
 * Tu je len `id` a názov, ktorý číta návštevník. Samotné farby sú v
 * `src/styles/tokens.css` v blokoch `[data-palette='…']` — `id` musí sedieť,
 * inak tlačidlo prepne atribút, ku ktorému neexistuje žiadne pravidlo.
 *
 * Prepínač zapisuje `id` na `<html data-palette="…">` a do localStorage.
 */

export const PALETTES = [
  { id: 'antracit', label: 'antracit + oranžová' },
  { id: 'modra', label: 'grafit + modrá' },
  { id: 'zelena', label: 'bridlica + zelená' },
  { id: 'limetka', label: 'uhlie + limetka' },
  { id: 'bordo', label: 'bordó + krém' },
  { id: 'neutral', label: 'čisto neutrálna' },
] as const;

/** Paleta bez uloženej voľby. Jej hodnoty sú priamo v `:root`, atribút netreba. */
export const DEFAULT_PALETTE = 'antracit';

/** Zoznam platných id — skript ním overuje hodnotu z localStorage. */
export const PALETTE_IDS: string[] = PALETTES.map((p) => p.id);

/**
 * Kľúč v localStorage. Pri zmene kľúča sa všetkým návštevníkom vráti
 * východisková paleta, lebo starý záznam už nikto nečíta.
 */
export const PALETTE_STORAGE_KEY = 'stavbex-palette';

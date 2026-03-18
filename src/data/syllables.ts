import type { SyllableData } from '../types'

// Syllable combinations for the first 7 consonants (M, P, S, L, T, N, D)
// paired with all 5 vowels (a, e, i, o, u).

export const SYLLABLES: SyllableData[] = [
  // ── M ────────────────────────────────────────────────────────────────────
  { consonant: 'm', vowel: 'a', syllable: 'ma', exampleWord: 'mamá',   exampleEmoji: '👩' },
  { consonant: 'm', vowel: 'e', syllable: 'me', exampleWord: 'mesa',   exampleEmoji: '🪑' },
  { consonant: 'm', vowel: 'i', syllable: 'mi', exampleWord: 'miel',   exampleEmoji: '🍯' },
  { consonant: 'm', vowel: 'o', syllable: 'mo', exampleWord: 'mono',   exampleEmoji: '🐒' },
  { consonant: 'm', vowel: 'u', syllable: 'mu', exampleWord: 'muñeca', exampleEmoji: '🪆' },

  // ── P ────────────────────────────────────────────────────────────────────
  { consonant: 'p', vowel: 'a', syllable: 'pa', exampleWord: 'papá',   exampleEmoji: '👨' },
  { consonant: 'p', vowel: 'e', syllable: 'pe', exampleWord: 'pera',   exampleEmoji: '🍐' },
  { consonant: 'p', vowel: 'i', syllable: 'pi', exampleWord: 'pino',   exampleEmoji: '🌲' },
  { consonant: 'p', vowel: 'o', syllable: 'po', exampleWord: 'pollo',  exampleEmoji: '🐔' },
  { consonant: 'p', vowel: 'u', syllable: 'pu', exampleWord: 'pulpo',  exampleEmoji: '🐙' },

  // ── S ────────────────────────────────────────────────────────────────────
  { consonant: 's', vowel: 'a', syllable: 'sa', exampleWord: 'sapo',   exampleEmoji: '🐸' },
  { consonant: 's', vowel: 'e', syllable: 'se', exampleWord: 'sello',  exampleEmoji: '📮' },
  { consonant: 's', vowel: 'i', syllable: 'si', exampleWord: 'silla',  exampleEmoji: '🪑' },
  { consonant: 's', vowel: 'o', syllable: 'so', exampleWord: 'sopa',   exampleEmoji: '🍲' },
  { consonant: 's', vowel: 'u', syllable: 'su', exampleWord: 'sube',   exampleEmoji: '⬆️' },

  // ── L ────────────────────────────────────────────────────────────────────
  { consonant: 'l', vowel: 'a', syllable: 'la', exampleWord: 'lata',   exampleEmoji: '🥫' },
  { consonant: 'l', vowel: 'e', syllable: 'le', exampleWord: 'leche',  exampleEmoji: '🥛' },
  { consonant: 'l', vowel: 'i', syllable: 'li', exampleWord: 'limón',  exampleEmoji: '🍋' },
  { consonant: 'l', vowel: 'o', syllable: 'lo', exampleWord: 'lobo',   exampleEmoji: '🐺' },
  { consonant: 'l', vowel: 'u', syllable: 'lu', exampleWord: 'luna',   exampleEmoji: '🌙' },

  // ── T ────────────────────────────────────────────────────────────────────
  { consonant: 't', vowel: 'a', syllable: 'ta', exampleWord: 'taza',   exampleEmoji: '☕' },
  { consonant: 't', vowel: 'e', syllable: 'te', exampleWord: 'tela',   exampleEmoji: '🧵' },
  { consonant: 't', vowel: 'i', syllable: 'ti', exampleWord: 'tigre',  exampleEmoji: '🐯' },
  { consonant: 't', vowel: 'o', syllable: 'to', exampleWord: 'toro',   exampleEmoji: '🐂' },
  { consonant: 't', vowel: 'u', syllable: 'tu', exampleWord: 'tubo',   exampleEmoji: '🪠' },

  // ── N ────────────────────────────────────────────────────────────────────
  { consonant: 'n', vowel: 'a', syllable: 'na', exampleWord: 'nariz',  exampleEmoji: '👃' },
  { consonant: 'n', vowel: 'e', syllable: 'ne', exampleWord: 'nena',   exampleEmoji: '👧' },
  { consonant: 'n', vowel: 'i', syllable: 'ni', exampleWord: 'niño',   exampleEmoji: '👦' },
  { consonant: 'n', vowel: 'o', syllable: 'no', exampleWord: 'noche',  exampleEmoji: '🌃' },
  { consonant: 'n', vowel: 'u', syllable: 'nu', exampleWord: 'nube',   exampleEmoji: '☁️' },

  // ── D ────────────────────────────────────────────────────────────────────
  { consonant: 'd', vowel: 'a', syllable: 'da', exampleWord: 'dado',   exampleEmoji: '🎲' },
  { consonant: 'd', vowel: 'e', syllable: 'de', exampleWord: 'dedo',   exampleEmoji: '☝️' },
  { consonant: 'd', vowel: 'i', syllable: 'di', exampleWord: 'dino',   exampleEmoji: '🦕' },
  { consonant: 'd', vowel: 'o', syllable: 'do', exampleWord: 'dona',   exampleEmoji: '🍩' },
  { consonant: 'd', vowel: 'u', syllable: 'du', exampleWord: 'ducha',  exampleEmoji: '🚿' },
]

/** SYLLABLE_GROUPS groups all syllables by their consonant letter. */
export const SYLLABLE_GROUPS: Record<string, SyllableData[]> = SYLLABLES.reduce<
  Record<string, SyllableData[]>
>((acc, s) => {
  if (!acc[s.consonant]) acc[s.consonant] = []
  acc[s.consonant].push(s)
  return acc
}, {})

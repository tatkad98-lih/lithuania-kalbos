// A2 word translations from egzaminu_temos_a2.html: exact forms + stems.
import { exact as EXACT, stems as STEMS } from './examDictionary.js';

const STEM_KEYS = Object.keys(STEMS)
  .filter((k) => !k.includes(' '))
  .sort((a, b) => b.length - a.length);

function lookupWord(raw) {
  const w = raw.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(EXACT, w)) return EXACT[w];
  if (Object.prototype.hasOwnProperty.call(STEMS, w)) return STEMS[w];
  for (const stem of STEM_KEYS) {
    if (stem.length >= 3 && w.startsWith(stem)) return STEMS[stem];
  }
  return null;
}

export function translateWord(ltWord) {
  if (!ltWord) return null;
  const clean = ltWord.toLowerCase().replace(/[.,!?;:()«»"„“—–-]+/g, '');
  if (!clean) return null;
  return lookupWord(clean);
}

export function googleTranslateUrl(ltWord) {
  return (
    'https://translate.google.com/?sl=lt&tl=ru&text=' +
    encodeURIComponent(ltWord) +
    '&op=translate'
  );
}

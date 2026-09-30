export const practiceModes = [
  { id: 'spelling', hash: '#rasyba', label: 'Rašyba', note: 'Правописание' },
  { id: 'writing', hash: '#rastai', label: 'Rašto treneris', note: 'Письмо' },
  { id: 'speaking', hash: '#pokalbiai', label: 'Pokalbiai', note: 'Говорим' },
];

export const MODE_BY_HASH = Object.fromEntries(practiceModes.map((m) => [m.hash, m.id]));

export const HASH_BY_MODE = Object.fromEntries(practiceModes.map((m) => [m.id, m.hash]));
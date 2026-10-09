import { useCallback, useMemo, useState } from 'react';

const KEY = 'knownWords';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

// Heart mark: "I know this word well". Kept apart from stars, which mean "pinned".
export function useKnown() {
  const [keys, setKeys] = useState(load);

  const knownSet = useMemo(() => new Set(keys), [keys]);

  const toggleKnown = useCallback((key) => {
    setKeys((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // storage unavailable
      }
      return next;
    });
  }, []);

  const isKnown = useCallback((key) => knownSet.has(key), [knownSet]);

  return { knownKeys: keys, knownSet, toggleKnown, isKnown };
}
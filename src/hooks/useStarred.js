import { useCallback, useMemo, useState } from 'react';

const KEY = 'starredWords';

export function wordKey(w) {
  return `${w.lt}||${w.ru}`;
}

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

export function useStarred() {
  const [keys, setKeys] = useState(load);

  const starredSet = useMemo(() => new Set(keys), [keys]);

  const toggleStar = useCallback((key) => {
    setKeys((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
      }
      return next;
    });
  }, []);

  const isStarred = useCallback((key) => starredSet.has(key), [starredSet]);

  return { starredKeys: keys, starredSet, toggleStar, isStarred };
}

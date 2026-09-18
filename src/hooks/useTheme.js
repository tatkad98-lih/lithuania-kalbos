import { useEffect, useState } from 'react';

const KEY = 'theme';

// Дефолт — светлая. Тёмная только если сохранена в localStorage.
// Переключение — сменой data-theme на <html>, без перезагрузки.
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      // приватный режим — просто не сохраняем
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return [theme, toggle];
}

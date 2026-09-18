import { useEffect, useState } from 'react';

// Прячет элемент при скролле вниз, показывает при скролле вверх.
// Работает только на мобилке (max-width: 640px), на десктопе всегда false.
export function useHideOnScroll(threshold = 80) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (!mq.matches) {
          setHidden(false);
        } else if (y < threshold) {
          setHidden(false);
        } else {
          setHidden(y > lastY);
        }
        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return hidden;
}

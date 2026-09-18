import { useRef, useEffect, useState } from 'react';
import './styles.scss';

export function Word({ lt, ru, active, onClick, ref: forwardedRef }) {
  const localRef = useRef(null);
  const [tooltipStyle, setTooltipStyle] = useState({});

  const ref = forwardedRef || localRef;

  useEffect(() => {
    if (active && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const containerRect = ref.current.closest('.reader__lt')?.getBoundingClientRect();
      if (containerRect) {
        setTooltipStyle({
          left: `${rect.left - containerRect.left + rect.width / 2}px`,
          bottom: `${rect.height + 4}px`,
        });
      }
    }
  }, [active, ref]);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      className={`word ${active ? 'word--active' : ''}`}
      title={ru ? `${lt} — ${ru}` : lt}
      style={active && tooltipStyle ? { '--tooltip-left': tooltipStyle.left, '--tooltip-bottom': tooltipStyle.bottom } : {}}
    >
      {active && ru && (
        <span className="word__tooltip" style={{ left: tooltipStyle.left, bottom: tooltipStyle.bottom }}>
          {ru}
        </span>
      )}
      <span className="word__lt">{lt}</span>
    </button>
  );
}
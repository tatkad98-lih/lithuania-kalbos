import './styles.scss';

export function Word({ lt, ru, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? 'word word--active' : 'word'}
      title={ru ? `${lt} — ${ru}` : lt}
    >
      {active && <span className="word__ru">{ru || 'нет перевода'}</span>}
      <span className="word__lt">{lt}</span>
    </button>
  );
}

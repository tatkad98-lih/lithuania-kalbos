import './styles.scss';

// Горизонтальная скролл-лента вкладок-пилюль, как список тем в Текстах.
// items: [{ id, label }], activeId, onSelect(id)
export function ScrollTabs({ items, activeId, onSelect }) {
  return (
    <div className="scrolltabs">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`scrolltabs__tab ${item.id === activeId ? 'scrolltabs__tab--active' : ''}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

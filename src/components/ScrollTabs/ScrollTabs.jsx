import './styles.scss';

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

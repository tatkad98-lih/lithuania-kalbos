import { BookOpenText, Languages, Layers, Keyboard, Sun, Moon } from 'lucide-react';
import { useHideOnScroll } from '../../hooks/useHideOnScroll.js';
import './styles.scss';

export function Header({ view, onNavigate, theme, onToggleTheme }) {
  const hidden = useHideOnScroll();

  const go = (e, v) => {
    e.preventDefault();
    onNavigate(v);
  };

  return (
    <header className={`header ${hidden ? 'header--hidden' : ''}`}>
      <div className="header__inner">
        <div className="header__logo">
          <span className="header__logo-icon">
            <Languages size={22} strokeWidth={2.2} />
          </span>
          <span className="header__logo-text">
            Lietuvių <em>mokykla</em>
            <small>проект для изучения литовского</small>
          </span>
        </div>

        <nav className="header__nav">
          <a
            href="#tekstai"
            onClick={(e) => go(e, 'tekstai')}
            className={`header__link ${view === 'tekstai' ? 'header__link--active' : ''}`}
          >
            <BookOpenText size={16} />
            Тексты
          </a>
          <a
            href="#zodziai"
            onClick={(e) => go(e, 'zodziai')}
            className={`header__link ${view === 'zodziai' ? 'header__link--active' : ''}`}
          >
            Слова
          </a>
          <a
            href="#korteles"
            onClick={(e) => go(e, 'korteles')}
            className={`header__link ${view === 'korteles' ? 'header__link--active' : ''}`}
          >
            <Layers size={16} />
            Карточки
          </a>
          <a
            href="#rasyba"
            onClick={(e) => go(e, 'rasyba')}
            className={`header__link ${view === 'rasyba' ? 'header__link--active' : ''}`}
          >
            <Keyboard size={16} />
            Rašyba
          </a>
        </nav>

        <button
          type="button"
          onClick={onToggleTheme}
          className="header__theme"
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
      <div className="header__flag">
        <span className="header__flag-yellow" />
        <span className="header__flag-green" />
        <span className="header__flag-red" />
      </div>
    </header>
  );
}

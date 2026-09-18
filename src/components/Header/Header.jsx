import { BookOpenText, Languages } from 'lucide-react';
import './styles.scss';

export function Header() {
  return (
    <header className="header">
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
          <a href="#" className="header__link header__link--active">
            <BookOpenText size={16} />
            Главная
          </a>
          <a href="#" className="header__link">
            Слова
          </a>
          <a href="#" className="header__link">
            Грамматика
          </a>
        </nav>
      </div>
      <div className="header__flag">
        <span className="header__flag-yellow" />
        <span className="header__flag-green" />
        <span className="header__flag-red" />
      </div>
    </header>
  );
}

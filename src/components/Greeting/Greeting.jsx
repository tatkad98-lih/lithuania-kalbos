import { useState } from 'react';
import { Button } from '@base-ui/react/button';
import { Heart, Sparkles, Languages } from 'lucide-react';
import './styles.scss';

export function Greeting() {
  const [likes, setLikes] = useState(0);

  return (
    <section className="greeting">
      <div className="greeting__card">
        <p className="greeting__badge">
          <Sparkles size={15} />
          Labas! Это старт твоего проекта
        </p>

        <h1 className="greeting__title">Hello Tatsiana</h1>

        <p className="greeting__subtitle">
          По-литовски «привет» — <strong>Labas!</strong> А «спасибо» —{' '}
          <strong>Ačiū!</strong>
          <br />
          Здесь мы будем учить литовский язык шаг за шагом.
        </p>

        <div className="greeting__words">
          <div className="greeting__word">
            <Languages size={16} />
            <span>
              Labas <small>— привет</small>
            </span>
          </div>
          <div className="greeting__word">
            <Heart size={16} />
            <span>
              Ačiū <small>— спасибо</small>
            </span>
          </div>
        </div>

        <div className="greeting__actions">
          <Button
            className="greeting__button greeting__button--primary"
            onClick={() => setLikes((v) => v + 1)}
          >
            <Heart size={16} />
            {likes === 0 ? 'Pradėti mokytis' : `Puiku! +${likes}`}
          </Button>

          <Button className="greeting__button greeting__button--ghost">
            Kaip sekasi?
          </Button>
        </div>

        {likes > 0 && (
          <p className="greeting__hint">
            Šaunuolė, Tatsiana! Ты нажала {likes} раз. Так держать!
          </p>
        )}
      </div>
    </section>
  );
}

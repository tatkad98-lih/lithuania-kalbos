import { useState, useRef, useEffect } from 'react';
import { Button } from '@base-ui/react/button';
import { Languages, Eye, EyeOff, MousePointerClick } from 'lucide-react';
import { Word } from '../Word';
import { translateWord } from '../../data/dictionary.js';
import './styles.scss';

function tokenize(lt) {
  return lt.split(/\s+/).filter(Boolean);
}

// Объединяем все абзацы в один текст
const fullText = `Mano vardas Polina Sokol, man keturiasdešimt vieneri metai. Mūsų šeima atvyko gyventi į Lietuvą prieš ketverius metus. Aš gimiau ir užaugau Baltarusijos Respublikos sostinėje Minske. Dabar gyvenu Vilniuje. Mano gimtoji kalba – rusų. Aš laisvai kalbu baltarusiškai ir angliškai. Mokiausi taip pat vokiečių kalbą, bet šiuo metu ją nesinaudoju. Pernai pradėjau mokytis lietuvių kalbos. Man labai svarbu mokėti valstybinę kalbą tos šalies, kurioje gyvenu. Lietuvių kalba yra melodinga. Man patinka mokytis lietuvių kalbos.

Mano šeima nėra didelė. Turiu vyrą Sergejų, dukrą Aną ir sūnų Piotrą. Mes visi gyvename moderniame bute gražiame Pašilaičių rajone. Tai jaukus rajonas su parkais ir žaidimų aikštelėmis, jame patogu auginti vaikus. Žiemą mėgstame leisti su rogutėmis nuo kalnelio šalia mūsų namų.

Mano vyras dirba programuotoju lietuvių įmonėje. Jam labai patinka jo darbas. Jis dirba tarptautinėje komandoje, bendrauja angliškai ir mokosi kalbėti lietuviškai.

Mūsų vaikai mokosi mokykloje. Jie mėgsta plaukioti, žiemą čiuožinėti pačiūžomis, o vasarą jodinėti žirgais. Groja pianinu ir žaidžia „PlayStation“. Mano dukra mėgsta siuvinėti ir velti iš vilnos, o sūnus mėgsta konstruoti „Lego“.`;

const fullRu = `Меня зовут Полина Сокол, мне сорок один год. Наша семья приехала жить в Литву четыре года назад. Я родилась и выросла в столице Республики Беларусь городе Минске. Сейчас я живу в Вильнюсе. Мой родной язык — русский. Я свободно говорю на белорусском и английском. Я также изучала немецкий язык, но сейчас им не пользуюсь. В прошлом году я начала изучать литовский язык. Для меня очень важно знать государственный язык страны, в которой я живу. Литовский язык мелодичный. Мне нравится учить литовский язык.

Моя семья небольшая. У меня есть муж Сергей, дочка Анна и сын Пётр. Мы все живём в современной квартире в красивом районе Пашилайчай. Это уютный район с парками и игровыми площадками, где удобно растить детей. Зимой мы любим кататься с горки возле нашего дома.

Мой муж работает программистом в литовской компании. Ему очень нравится его работа. Он работает в интернациональной команде. Общается на английском и учит литовский язык.

Наши дети учатся в школе. Они любят плавать, кататься на коньках зимой и летом на лошадях. Играют на пианино и в плейстейшн. Моя дочка любит вышивать и валять из шерсти. Мой сын любит конструировать лего.`;

export function TextReader() {
  const [activeKey, setActiveKey] = useState(null);
  const [showFullRu, setShowFullRu] = useState(false);
  const tokens = tokenize(fullText);
  const wordRefs = useRef([]);

  const handleWordClick = (idx) => {
    setActiveKey((prev) => (prev === idx ? null : idx));
  };

  const clearActive = () => setActiveKey(null);

  return (
    <div className="reader">
      <div className="reader__hint">
        <MousePointerClick size={16} />
        <span>Нажми на любое литовское слово — над ним появится перевод</span>
      </div>

      <div className="reader__controls">
        <Button
          className="reader__btn reader__btn--primary"
          onClick={() => setShowFullRu((v) => !v)}
        >
          {showFullRu ? <EyeOff size={15} /> : <Eye size={15} />}
          {showFullRu ? 'Скрыть полный перевод' : 'Показать полный перевод'}
        </Button>
        <Button className="reader__btn" onClick={clearActive}>
          <Languages size={15} />
          Сбросить
        </Button>
      </div>

      <div className="reader__body">
        <p className="reader__lt">
          {tokens.map((token, idx) => {
            const ru = translateWord(token);
            return (
              <Word
                key={idx}
                lt={token}
                ru={ru}
                active={activeKey === idx}
                onClick={() => handleWordClick(idx)}
                ref={(el) => (wordRefs.current[idx] = el)}
              />
            );
          })}
        </p>

        {showFullRu && (
          <div className="reader__full-ru">
            {fullRu.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
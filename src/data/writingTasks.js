// Writing tasks of the Lithuanian state exam (B1) plus the learner's own details.
export const aboutMe = [
  { lt: 'Vardas', ru: 'Таня' },
  { lt: 'Profesija', ru: 'воспитатель в детском саду' },
  { lt: 'Gyvenimas', ru: 'съёмная двухкомнатная квартира' },
  { lt: 'Mityba', ru: 'готовлю сама: макароны, курица, картошка' },
  { lt: 'Pomėgiai', ru: 'прогулки в парке' },
];

export const starters = {
  renginys: 'Labas, Aiste! Noriu pakviesti tave į …',
  ekskursija: 'Labas, Tomai! Važiuojame į …',
  skelbimas: 'Ieškau darbo …',
  maistas: 'Sveiki! Lietuvoje man labiausiai patinka …',
};

export const writingTasks = [
  {
    id: 'renginys',
    emoji: '🎭',
    titleRu: 'Приглашение на мероприятие',
    topic: 'Kvietimas į renginį',
    brief:
      'Norite pakviesti draugą į renginį (koncertą, parodą ar kiną). Parašykite žinutę (20–30 žodžių) ir nurodykite:',
    points: [
      'koks tai renginys ir kiek kainuoja bilietas;',
      'kur ir kada jis vyksta;',
      'kur ir kada susitiksite.',
    ],
    modelLt:
      'Labas, Aiste! Noriu pakviesti tave į „Mamutė“ operą. Bilietas kainuoja 25 eurus. Renginys vyks birželio 14 dieną 19 valandą Vilniaus operos teatre. Susitikime 18.30 priešais. Tikėsiu, kad patiks!',
    modelRu:
      'Привет, Айсте! Хочу пригласить тебя на оперу «Мамуля». Билет стоит 25 евро. Мероприятие состоится 14 июня в 19:00 в Вильнюсском оперном театре. Встречаемся в 18:30 у склада. Надеюсь, тебе понравится!',
  },
  {
    id: 'ekskursija',
    emoji: '🏰',
    titleRu: 'Приглашение на экскурсию',
    topic: 'Kvietimas į ekskursiją',
    brief: 'Norite pakviesti draugą į ekskursiją. Parašykite žinutę (20–30 žodžių) ir nurodykite:',
    points: ['kur vyksite;', 'kodėl tai turėtų sudominti;', 'kada ir kur susitiksite.'],
    modelLt:
      'Labas, Tomai! Važiuojame į Trakų pilies muziejų. Ten labai graži viduramžių architektūra, o mugėse būva keramikos. Važiuojame gegužės 18 dieną. Susitikime 9 valandą prie Vilniaus geležinkelio stoties.',
    modelRu:
      'Привет, Томас! Мы едем в музей Тракайского замка. Там очень красивая средневековая архитектура, а на ярмарках бывает керамика. Едем 18 мая. Встречаемся в 9:00 у Вильнюсского вокзала.',
  },
  {
    id: 'skelbimas',
    emoji: '📢',
    titleRu: 'Объявление о поиске работы',
    topic: 'Darbo paieškos skelbimas',
    brief: 'Norite vasarą dirbti. Parašykite skelbimą (20–30 žodžių) ir nurodykite:',
    points: ['kokio darbo ieškote;', 'kokio atlyginimo norite;', 'kur ir kam skambinti.'],
    modelLt:
      'Ieškau darbo vasaros stovykloje – vėdėja arba auklė. Siūlyti 600 eurų per mėnesį ir gyvenamas kambarys. Išstudijavau pedagogiką, turiu dveju metų darbo patirtį. Skambinkite į 8 123 4567.',
    modelRu:
      'Ищу работу в летнем лагере — воспитатель или помощник. Предлагаю 600 евро в месяц и общежитие. Закончила педагогику, у меня два года опыта работы. Звоните по номеру 8 123 4567.',
  },
  {
    id: 'maistas',
    emoji: '🥟',
    titleRu: 'Любимая еда',
    topic: 'Mėgstamas maistas',
    brief:
      'Draugas iš užsienio klausia apie maistą Lietuvoje. Parašykite žinutę (20–30 žodžių) ir nurodykite:',
    points: [
      'kokie patiekalai jums patinka;',
      'kur mėgstate valgyti;',
      'ką patartumėte paragauti svečiui.',
    ],
    modelLt:
      'Sveiki! Lietuvoje man labiausiai patinka blynai su grietinė ir koldūnai. Paprastai valgau namuose: ruošiuosi makaronus su vištos file ir keptas bulves. Svečiui patarčiau paragauti koldūnų su grietinės.',
    modelRu:
      'Здравствуйте! В Литве мне больше всего нравятся блинчики со сметаной и пельмени. Обычно я ем дома: готовлю макароны с куриным филе и печёный картофель. Гостю я бы посоветовала попробовать пельмени со сметаной.',
  },
];
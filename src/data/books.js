import { knyga1Sections } from './knyga1/index.js';
import { knyga2Sections } from './knyga2/index.js';

export const books = [
  {
    id: 'knyga-1',
    nr: 1,
    titleRu: 'Книга 1',
    titleLt: 'Nė dienos be lietuvių kalbos',
    subtitleLt: 'Vadovėlis pradedantiems',
    year: '2020',
    wordUnit: 'уроков',
    tone: 'warm',
    kind: 'lessons',
    sections: knyga1Sections,
  },
  {
    id: 'knyga-2',
    nr: 2,
    titleRu: 'Книга 2',
    titleLt: 'Nė dienos be lietuvių kalbos',
    subtitleLt: 'Antroji knyga',
    year: '2014',
    wordUnit: 'глав',
    tone: 'cool',
    kind: 'lessons',
    sections: knyga2Sections,
  },
  {
    // Theme dictionary, 9000 words. The word data itself lives in knyga3/ and is
    // only pulled in when this book is opened, so it stays out of the main bundle.
    id: 'knyga-3',
    nr: 3,
    titleRu: 'Книга 3',
    titleLt: 'Русско-литовский тематический словарь',
    subtitleLt: '9000 слов',
    year: '2019',
    wordUnit: 'тем',
    tone: 'green',
    kind: 'thematic',
    partCount: 9,
    themeCount: 256,
    wordCount: 8853,
  },
  {
    // Verb list. The word data itself lives in knyga4/ and is only pulled in
    // when this book is opened.
    id: 'knyga-4',
    nr: 4,
    titleRu: 'Глаголы',
    titleLt: '365 глаголов литовского языка',
    subtitleLt: '6 форм каждого глагола',
    year: '',
    wordUnit: 'частей',
    tone: 'violet',
    kind: 'thematic',
    partCount: 19,
    themeCount: 19,
    wordCount: 365,
  },
];

export const countWords = (book) =>
  book.kind === 'thematic'
    ? book.wordCount
    : book.sections.reduce(
        (sum, section) => sum + section.words.filter((word) => word.kind !== 'group').length,
        0,
      );

export const countSections = (book) =>
  book.kind === 'thematic' ? book.themeCount : book.sections.length;
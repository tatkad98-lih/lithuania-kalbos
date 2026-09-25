import { knyga1Sections } from './knyga1/index.js';
import { knyga2Sections } from './knyga2/index.js';

export const books = [
  {
    id: 'knyga-1',
    nr: 1,
    titleRu: 'Книга 1',
    titleLt: 'Nė dienos be lietuvių kalbos. Vadovėlis pradedantiems',
    year: '2020',
    sections: knyga1Sections,
  },
  {
    id: 'knyga-2',
    nr: 2,
    titleRu: 'Книга 2',
    titleLt: 'Nė dienos be lietuvių kalbos. Antroji knyga',
    year: '2014',
    sections: knyga2Sections,
  },
];

export const countWords = (book) =>
  book.sections.reduce(
    (sum, section) => sum + section.words.filter((word) => word.kind !== 'group').length,
    0,
  );

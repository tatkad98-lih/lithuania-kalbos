import { section1 } from './section1.js';
import { section2 } from './section2.js';
import { section3 } from './section3.js';
import { section4 } from './section4.js';
import { section5 } from './section5.js';
import { section6 } from './section6.js';
import { section7 } from './section7.js';
import { section8 } from './section8.js';
import { section9 } from './section9.js';
import { section10 } from './section10.js';

export const nedienosbeSections = [
  section1,
  section2,
  section3,
  section4,
  section5,
  section6,
  section7,
  section8,
  section9,
  section10,
];

export const nedienosbeWords = nedienosbeSections.flatMap((section) => section.words);

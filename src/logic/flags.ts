import { Flag } from '../types/index';

const allFlags: { [code: string]: string } = {
  br: 'Brazil',
  us: 'United States',
  fr: 'France',
  jp: 'Japan',
  de: 'Germany',
  it: 'Italy',
  es: 'Spain',
  gb: 'United Kingdom',
  ca: 'Canada',
  au: 'Australia',
  in: 'India',
  cn: 'China',
  ru: 'Russia',
  mx: 'Mexico',
  ar: 'Argentina',
  za: 'South Africa',
  kr: 'South Korea',
  se: 'Sweden',
  nl: 'Netherlands',
  pt: 'Portugal',
  no: 'Norway',
  fi: 'Finland',
  is: 'Iceland',
  gr: 'Greece',
  tr: 'Turkey',
  sa: 'Saudi Arabia',
  il: 'Israel',
  eg: 'Egypt',
  ng: 'Nigeria',
  ke: 'Kenya',
  ma: 'Morocco',
  dz: 'Algeria',
  tn: 'Tunisia',
  th: 'Thailand',
  vn: 'Vietnam',
  ph: 'Philippines',
  my: 'Malaysia',
  id: 'Indonesia',
  nz: 'New Zealand',
  pl: 'Poland',
  hu: 'Hungary',
  ch: 'Switzerland',
  be: 'Belgium',
  at: 'Austria',
  cz: 'Czech Republic',
  ua: 'Ukraine',
  ro: 'Romania',
  bg: 'Bulgaria',
  sk: 'Slovakia',
  hr: 'Croatia',
  si: 'Slovenia',
  pk: 'Pakistan',
  bd: 'Bangladesh'
};

export const getRandomQuestion = (excludeId?: string): Flag => {
  const countryCodes = Object.keys(allFlags);
  const filteredCodes = excludeId
    ? countryCodes.filter(code => code !== excludeId)
    : countryCodes;

  const correctCode = filteredCodes[Math.floor(Math.random() * filteredCodes.length)];
  const correctCountry = allFlags[correctCode];

  // Escolhe 3 erradas
  const wrongOptions = countryCodes.filter(code => code !== correctCode);
  const shuffled = shuffleArray(wrongOptions).slice(0, 3);
  const alternatives = shuffleArray([correctCountry, ...shuffled.map(code => allFlags[code])]);

  return {
    id: correctCode,
    country: correctCountry,
    imageUrl: `https://flagcdn.com/w320/${correctCode}.png`,
    alternatives
  };
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

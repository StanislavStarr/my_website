import type {Locale} from './paths';

export const ogImagePath = (locale: Locale) => locale === 'ru' ? '/og-image/ru' : '/og-image';

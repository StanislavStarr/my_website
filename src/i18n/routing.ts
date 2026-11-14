import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  localeDetection: false,
  localeCookie: false,

  alternateLinks: false
});

export type Locale = (typeof routing.locales)[number];

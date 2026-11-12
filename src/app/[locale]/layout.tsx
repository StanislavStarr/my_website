import type {ReactNode} from 'react';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {Header} from '@/components/Header';
import {Enhancements} from '@/components/Enhancements';
import '@/styles/globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, modal, params}: {
  children: ReactNode; modal: ReactNode; params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages({locale});
  return <html lang={locale}>
    <body>
      <NextIntlClientProvider locale={locale} timeZone="UTC" messages={{game: messages.game, motion: messages.motion}}>
        <Header locale={locale} />
        {children}
        {modal}
        <Enhancements />
      </NextIntlClientProvider>
    </body>
  </html>;
}

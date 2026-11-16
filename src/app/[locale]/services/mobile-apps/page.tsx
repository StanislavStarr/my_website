import {notFound} from 'next/navigation';
import {hasLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import {ServicePage, type StackGroup} from '@/components/ServicePage';

const PATH = '/services/mobile-apps';
type Props = {params: Promise<{locale: string}>};

// The mobile stack named on the site: React Native + Expo, with React and TypeScript, and Node.js for the API.
const stack: StackGroup[] = [
  {label: 'lcdMobile', items: ['React Native', 'Expo']},
  {label: 'lcdInterface', items: ['React', 'TypeScript']},
  {label: 'lcdServer', items: ['Node.js']}
];

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({locale, namespace: 'mobile'});
  return pageMetadata({locale, path: PATH, title: t('title'), description: t('description')});
}

export default async function MobileApps({params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // No case table: there are no published mobile cases yet, so the page does not imply any.
  return <ServicePage locale={locale} namespace="mobile" path={PATH} stack={stack} buildCount={5} showCases={false} />;
}

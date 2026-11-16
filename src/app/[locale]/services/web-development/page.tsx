import {notFound} from 'next/navigation';
import {hasLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import {ServicePage, type StackGroup} from '@/components/ServicePage';

const PATH = '/services/web-development';
type Props = {params: Promise<{locale: string}>};

const stack: StackGroup[] = [
  {label: 'lcdInterface', items: ['React', 'Vue', 'TypeScript']},
  {label: 'lcdFrameworks', items: ['Next.js', 'Nuxt']},
  {label: 'lcdServer', items: ['Node.js']}
];

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({locale, namespace: 'webDev'});
  return pageMetadata({locale, path: PATH, title: t('title'), description: t('description')});
}

export default async function WebDevelopment({params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <ServicePage locale={locale} namespace="webDev" path={PATH} stack={stack} buildCount={5} showCases />;
}

import {notFound} from 'next/navigation';
import {hasLocale} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import {ServicePage, type StackGroup} from '@/components/ServicePage';

const PATH = '/services/seo-geo';
type Props = {params: Promise<{locale: string}>};

// File names, standards and services: the same in both languages, only the group labels are translated.
const stack: StackGroup[] = [
  {label: 'lcdFoundation', items: ['robots.txt', 'Sitemap', 'Hreflang']},
  {label: 'lcdMarkup', items: ['Schema.org', 'JSON-LD']},
  {label: 'lcdMeasure', items: ['Search Console', 'Bing', 'Yandex']}
];

export async function generateMetadata({params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({locale, namespace: 'seoGeo'});
  return pageMetadata({locale, path: PATH, title: t('title'), description: t('description')});
}

export default async function SeoGeo({params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // No case table: there are no published SEO/GEO results yet, so the page does not imply any.
  return <ServicePage locale={locale} namespace="seoGeo" path={PATH} stack={stack} buildCount={5} showCases={false} />;
}

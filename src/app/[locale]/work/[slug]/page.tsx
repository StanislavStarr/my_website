import {notFound} from 'next/navigation';
import {hasLocale} from 'next-intl';
import {routing} from '@/i18n/routing';
import {getProject, projects} from '@/lib/projects';
import {pageMetadata} from '@/lib/seo';
import {cx} from '@/lib/styles';
import {site} from '@/lib/site';
import {CaseDetails} from '@/components/CaseDetails';
import {Contact} from '@/components/Contact';
import {StructuredData} from '@/components/StructuredData';

type Props = {params: Promise<{locale: string; slug: string}>};

export function generateStaticParams() {
  return projects.map(({slug}) => ({slug}));
}

export async function generateMetadata({params}: Props) {
  const {locale, slug} = await params;
  const project = getProject(slug);
  if (!project || !hasLocale(routing.locales, locale)) notFound();

  return pageMetadata({locale, path: '/work/' + slug,
    title: project[locale].title + ' — ' + site.name,
    description: project[locale].summary});
}

export default async function CasePage({params}: Props) {
  const {locale, slug} = await params;
  const project = getProject(slug);

  if (!project || !hasLocale(routing.locales, locale)) notFound();

  return (
    <main id="main" className={cx('wrap')} tabIndex={-1}>
      <StructuredData locale={locale} project={project} />
      <article className={cx('case-page')} aria-labelledby="case-title">
        <CaseDetails project={project} locale={locale} />
      </article>
      <Contact locale={locale} />
    </main>
  )
}

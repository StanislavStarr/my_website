import {notFound} from 'next/navigation';
import {hasLocale} from 'next-intl';
import {routing} from '@/i18n/routing';
import {getProject} from '@/lib/projects';
import {CaseDialog} from '@/components/CaseDialog';
import {CaseDetails} from '@/components/CaseDetails';

export {generateMetadata} from '../../../work/[slug]/page';

export default async function InterceptedCase({params}: {
  params: Promise<{locale: string; slug: string}>;
}) {
  const {locale, slug} = await params;
  const project = getProject(slug);
  
  if (!project || !hasLocale(routing.locales, locale)) notFound();
  
  return (
    <CaseDialog><CaseDetails project={project} locale={locale} modal /></CaseDialog>
  )
}

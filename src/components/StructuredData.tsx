import {getSiteOrigin} from '@/lib/seo';
import type {Locale} from '@/lib/paths';
import type {Project} from '@/lib/projects';
import {buildGraph, type ServiceItem} from '@/lib/structured-data';

export function StructuredData({locale, project, faq, services}: {
  locale: Locale; project?: Project; faq?: {q: string; a: string}[]; services?: ServiceItem[];
}) {
  const origin = getSiteOrigin();
  if (!origin) return null;

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify(buildGraph({origin, locale, project, faq, services})).replace(/</g, '\\u003c')
    }} />
  )
}

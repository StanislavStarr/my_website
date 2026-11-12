import {getSiteOrigin} from '@/lib/seo';
import {localizedPath, type Locale} from '@/lib/paths';
import {site} from '@/lib/site';
import type {Project} from '@/lib/projects';

export function StructuredData({locale, project}: {locale: Locale; project?: Project}) {
  const origin = getSiteOrigin();
  if (!origin) return null;
  const personId = origin + '/#person';
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': personId,
      name: site.name,
      url: origin,
      jobTitle: 'Independent web and mobile developer',
      image: origin + '/images/portrait.png',
      sameAs: [site.telegram],
      knowsAbout: ['Web development', 'React', 'Vue', 'TypeScript',
        'React Native', 'Expo', 'PWA', 'Telegram Mini Apps', 'Technical SEO']
    },
    {
      '@type': 'WebSite',
      '@id': origin + '/#website',
      name: site.name,
      url: origin,
      inLanguage: ['en', 'ru'],
      publisher: {'@id': personId}
    }
  ];

  if (project) {
    const copy = project[locale];
    graph.push({
      '@type': 'WebPage',
      name: copy.title + ' — ' + site.name,
      description: copy.summary,
      url: origin + localizedPath(locale, '/work/' + project.slug),
      inLanguage: locale,
      isPartOf: {'@id': origin + '/#website'},
      author: {'@id': personId},
      about: {
        '@type': 'Thing', name: copy.title,
        ...(project.url ? {url: project.url} : {})
      }
    });
  } else {
    for (const name of ['Interface design', 'Web development', 'Mobile app development',
      'Product maintenance', 'Launch and handover', 'SEO and AI search']) {
      graph.push({
        '@type': 'Service', name,
        provider: {'@id': personId},
        areaServed: 'Worldwide',
        url: origin + localizedPath(locale) + '#services'
      });
    }
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify({'@context': 'https://schema.org', '@graph': graph}).replace(/</g, '\\u003c')
    }} />
  )
}

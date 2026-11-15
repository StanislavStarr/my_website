import {getSiteOrigin} from '@/lib/seo';
import {localizedPath, type Locale} from '@/lib/paths';
import {site} from '@/lib/site';
import type {Project} from '@/lib/projects';

export function StructuredData({locale, project, faq}: {locale: Locale; project?: Project; faq?: {q: string; a: string}[]}) {
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
      '@type': 'ProfessionalService',
      '@id': origin + '/#service',
      name: site.name + ' — web & mobile development',
      url: origin,
      image: origin + '/og-image',
      email: site.email,
      founder: {'@id': personId},
      provider: {'@id': personId},
      knowsLanguage: ['ru', 'en'],
      areaServed: [
        ...['RU', 'BY', 'KZ', 'UZ', 'TJ', 'KG', 'AM', 'AZ', 'GE', 'MD'].map((code) => ({'@type': 'Country', name: code})),
        {'@type': 'Place', name: 'Worldwide (remote)'}
      ]
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
      breadcrumb: {'@type': 'BreadcrumbList', itemListElement: [
        {'@type': 'ListItem', position: 1, name: site.name, item: origin + localizedPath(locale)},
        {'@type': 'ListItem', position: 2, name: copy.title, item: origin + localizedPath(locale, '/work/' + project.slug)}
      ]},
      author: {'@id': personId},
      about: {
        '@type': 'Thing', name: copy.title,
        ...(project.url ? {url: project.url} : {})
      }
    });
  } else {
    if (faq?.length) graph.push({
      '@type': 'FAQPage',
      inLanguage: locale,
      mainEntity: faq.map(({q, a}) => ({'@type': 'Question', name: q, acceptedAnswer: {'@type': 'Answer', text: a}}))
    });
    for (const name of ['Interface design', 'Web development', 'Mobile app development',
      'Product maintenance', 'Launch and handover', 'SEO and AI search']) {
      graph.push({
        '@type': 'Service', name,
        provider: {'@id': personId},
        areaServed: ['RU', 'BY', 'KZ', 'UZ', 'TJ', 'KG', 'AM', 'AZ', 'GE', 'MD', 'Worldwide (remote)'],
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

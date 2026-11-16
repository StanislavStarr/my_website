import {localizedPath, type Locale} from './paths';
import {site, servedCountries} from './site';
import type {Project} from './projects';

export type ServiceItem = {name: string; description: string};

const areaServed = () => [
  ...servedCountries.map((name) => ({'@type': 'Country', name})),
  {'@type': 'Place', name: 'Europe'},
  {'@type': 'Place', name: 'Worldwide (remote)'}
];

export type ServicePage = {path: string; name: string; description: string};

export function buildGraph({origin, locale, project, faq, services = [], servicePage}: {
  origin: string; locale: Locale; project?: Project;
  faq?: {q: string; a: string}[]; services?: ServiceItem[]; servicePage?: ServicePage;
}) {
  const personId = origin + '/#person';
  const name = site.names[locale];
  const otherName = site.names[locale === 'ru' ? 'en' : 'ru'];
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': personId,
      name,
      alternateName: [otherName],
      url: origin,
      jobTitle: 'Independent web and mobile developer',
      image: origin + '/images/portrait.png',
      sameAs: [site.telegram, ...site.profiles],
      knowsLanguage: ['ru', 'en'],
      knowsAbout: ['Web development', 'Full-stack development', 'React', 'Vue', 'TypeScript',
        'React Native', 'Expo', 'PWA', 'SaaS', 'Telegram Mini Apps', 'Telegram bots',
        'Technical SEO', 'Generative engine optimization']
    },
    {
      '@type': 'ProfessionalService',
      '@id': origin + '/#service',
      name: name + ' — web & mobile development',
      url: origin,
      image: origin + '/og-image',
      email: site.email,
      founder: {'@id': personId},
      provider: {'@id': personId},
      knowsLanguage: ['ru', 'en'],
      areaServed: areaServed()
    },
    {
      '@type': 'WebSite',
      '@id': origin + '/#website',
      name,
      alternateName: otherName,
      url: origin,
      inLanguage: ['en', 'ru'],
      publisher: {'@id': personId}
    }
  ];

  if (servicePage) {
    const url = origin + localizedPath(locale, servicePage.path);
    graph.push({
      '@type': 'WebPage',
      '@id': url + '#webpage',
      name: servicePage.name + ' — ' + name,
      description: servicePage.description,
      url,
      inLanguage: locale,
      isPartOf: {'@id': origin + '/#website'},
      breadcrumb: {'@type': 'BreadcrumbList', itemListElement: [
        {'@type': 'ListItem', position: 1, name, item: origin + localizedPath(locale)},
        {'@type': 'ListItem', position: 2, name: servicePage.name, item: url}
      ]},
      mainEntity: {'@id': url + '#service'}
    }, {
      '@type': 'Service',
      '@id': url + '#service',
      name: servicePage.name,
      description: servicePage.description,
      inLanguage: locale,
      provider: {'@id': personId},
      areaServed: areaServed(),
      url
    });
  } else if (project) {
    const copy = project[locale];
    graph.push({
      '@type': 'WebPage',
      name: copy.title + ' — ' + name,
      description: copy.summary,
      url: origin + localizedPath(locale, '/work/' + project.slug),
      inLanguage: locale,
      isPartOf: {'@id': origin + '/#website'},
      breadcrumb: {'@type': 'BreadcrumbList', itemListElement: [
        {'@type': 'ListItem', position: 1, name, item: origin + localizedPath(locale)},
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
    for (const service of services) {
      graph.push({
        '@type': 'Service',
        name: service.name,
        description: service.description,
        inLanguage: locale,
        provider: {'@id': personId},
        areaServed: areaServed(),
        url: origin + localizedPath(locale) + '#services'
      });
    }
  }

  return {'@context': 'https://schema.org', '@graph': graph};
}

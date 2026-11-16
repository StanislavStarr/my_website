import type {MetadataRoute} from 'next';
import {getSiteOrigin} from '@/lib/seo';
import {localizedPath} from '@/lib/paths';
import {projects} from '@/lib/projects';
import {site} from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  if (!origin) return [];

  const absolute = (locale: 'en' | 'ru', path: string) => {
    const url = origin + localizedPath(locale, path);
    return url === origin + '/' ? origin : url;
  };
  const paths = ['/', ...projects.map(({slug}) => '/work/' + slug)];
  
  return paths.flatMap((path) => (['en', 'ru'] as const).map((locale) => ({
    url: absolute(locale, path),
    lastModified: site.contentUpdated,
    alternates: {languages: {
      en: absolute('en', path),
      ru: absolute('ru', path),
      'x-default': absolute('en', path)
    }}
  })));
}

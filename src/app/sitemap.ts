import type {MetadataRoute} from 'next';
import {getSiteOrigin} from '@/lib/seo';
import {localizedPath} from '@/lib/paths';
import {projects} from '@/lib/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteOrigin();
  if (!origin) return [];
  const paths = ['/', ...projects.map(({slug}) => '/work/' + slug)];
  
  return paths.flatMap((path) => (['en', 'ru'] as const).map((locale) => ({
    url: origin + localizedPath(locale, path),
    alternates: {languages: {
      en: origin + localizedPath('en', path),
      ru: origin + localizedPath('ru', path),
      'x-default': origin + localizedPath('en', path)
    }}
  })));
}

import type {Metadata} from 'next';
import {localizedPath, type Locale} from './paths';

export function getSiteOrigin(value = process.env.SITE_URL) {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
        url.pathname !== '/' || url.search || url.hash) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export function canIndex(origin: string | undefined, enabled = process.env.ENABLE_INDEXING) {
  if (!origin || enabled !== 'true') return false;
  const url = new URL(origin);
  return url.protocol === 'https:' &&
    !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) &&
    !url.hostname.endsWith('.localhost');
}

export function pageMetadata({
  locale, path = '/', title, description,
  origin = getSiteOrigin(), indexing
}: {
  locale: Locale; path?: string; title: string; description: string;
  origin?: string; indexing?: string;
}): Metadata {
  const absolute = (lang: Locale) => origin + localizedPath(lang, path);
  const index = canIndex(origin, indexing);
  return {
    title,
    description,
    robots: {index, follow: index},
    ...(origin ? {
      metadataBase: new URL(origin),
      alternates: {
        canonical: absolute(locale),
        languages: {en: absolute('en'), ru: absolute('ru'), 'x-default': absolute('en')}
      }
    } : {}),
    openGraph: {
      type: 'website',
      title,
      description,
      siteName: 'Stanislav Sinitsyn',
      locale: locale === 'ru' ? 'ru_RU' : 'en_US',
      alternateLocale: locale === 'ru' ? 'en_US' : 'ru_RU',
      ...(origin ? {
        url: absolute(locale),
        images: [{url: origin + '/og-image', width: 1200, height: 630, alt: title}]
      } : {})
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(origin ? {images: [origin + '/og-image']} : {})
    }
  };
}

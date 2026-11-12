export type Locale = 'en' | 'ru';

export function localizedPath(locale: Locale, path = '/') {
  const clean = path === '/' ? '' : '/' + path.replace(/^\/+|\/+$/g, '');
  return (locale === 'ru' ? '/ru' : '') + clean || '/';
}

export function unlocalizedPath(path: string) {
  return path.replace(/^\/(?:en|ru)(?=\/|$)/, '') || '/';
}

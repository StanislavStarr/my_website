'use client';

import {usePathname} from 'next/navigation';
import {localizedPath, unlocalizedPath, type Locale} from '@/lib/paths';
import {cx} from '@/lib/styles';

export function LanguageSwitcher({locale, label}: {locale: Locale; label: string}) {
  const pathname = unlocalizedPath(usePathname())

  return (
    <div className={cx('lang')} aria-label={label}>
      {(['en', 'ru'] as const).map((language) =>
        <a key={language} href={localizedPath(language, pathname)}
          hrefLang={language} lang={language} aria-label={language === 'en' ? 'English' : 'Русский'}
          aria-current={language === locale ? 'page' : undefined}>
          {language.toUpperCase()}
        </a>
      )}
    </div>
  )
}

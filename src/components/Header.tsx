import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import {LanguageSwitcher} from './LanguageSwitcher';
import {cx} from '@/lib/styles';
import {localizedPath, type Locale} from '@/lib/paths';
import {site} from '@/lib/site';

export async function Header({locale}: {locale: Locale}) {
  const t = await getTranslations({locale});
  const home = localizedPath(locale);

  return (
    <>
      <a className={cx('skip')} href="#main">{t('skip')}</a>
      
      <div className={cx('wrap')}>
        <header className={cx('top')}>
          <Link href={home} className={cx('brand')} aria-label={site.name + ' — ' + t('backHome')}>
            <span className={cx('brandmark')} aria-hidden="true" />{site.name}
          </Link>
          <nav className={cx('nav')} aria-label={t('navLabel')}>
            <Link href={home + '#work'}>{t('navWork')}</Link>
            <Link href={home + '#services'}>{t('navServices')}</Link>
            <Link href={home + '#contact'}>{t('navContact')}</Link>
            <LanguageSwitcher locale={locale} label={t('languageLabel')} />
          </nav>
        </header>
      </div>
    </>
  )
}

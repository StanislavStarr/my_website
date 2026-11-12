import Link from 'next/link';
import {getLocale, getTranslations} from 'next-intl/server';
import {cx} from '@/lib/styles';
import {localizedPath} from '@/lib/paths';

export default async function NotFound() {
  const locale = (await getLocale()) === 'ru' ? 'ru' : 'en';
  const t = await getTranslations({locale});
  return <main id="main" className={cx('wrap not-found')}>
    <span className={cx('mono muted')}>404</span>
    <h1>{t('pageNotFound')}</h1><p>{t('pageNotFoundText')}</p>
    <Link className={cx('pill solid')} data-pill href={localizedPath(locale)}>{t('backHome')} ↗</Link>
  </main>;
}

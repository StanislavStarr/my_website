import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import {projects} from '@/lib/projects';
import {cx, rv} from '@/lib/styles';
import {localizedPath, type Locale} from '@/lib/paths';
import {Icon} from '@/components/Icon';

/** The LCD table of real cases, shared by the landing page and the service pages. */
export async function WorkScreen({locale}: {locale: Locale}) {
  const t = await getTranslations({locale});

  return (
    <div className={cx('work-screen')}>
      <div className={cx('screen-label mono')}><span>{t('workTable')}</span><span>{t('selectCase')} <Icon name="arrow-down-left" /></span></div>
      {projects.map((project, index) => {
        const copy = project[locale];
        const [role, ...domain] = copy.listRole.split(' / ');
        return <Link key={project.slug} href={localizedPath(locale, '/work/' + project.slug)}
          {...rv('work-row', index + 1)} data-transition>
          <span className={cx('mono')}>{String(index + 1).padStart(2, '0')}</span>
          <span><span className={cx('work-title')}>{copy.title}</span><span className={cx('work-desc')}>{copy.short}</span></span>
          <span className={cx('work-role mono')}>{role}<br />{domain.join(' / ')}</span>
          <span className={cx('round-arrow')} aria-hidden="true"><Icon name="arrow-up-right" /></span>
        </Link>;
      })}
      <p className={cx('work-note mono')}>{t('workNote')}</p>
    </div>
  );
}

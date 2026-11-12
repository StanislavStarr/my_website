import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import {cx} from '@/lib/styles';
import {localizedPath, type Locale} from '@/lib/paths';
import type {Project} from '@/lib/projects';

export async function CaseDetails({project, locale, modal = false}: {
  project: Project; locale: Locale; modal?: boolean;
}) {
  const t = await getTranslations({locale});
  const copy = project[locale];
  const Heading = modal ? 'h2' : 'h1';
  const SectionHeading = modal ? 'h3' : 'h2';

  return (
    <div className={cx('case-shell')}>
      <div className={cx('case-top')}>
        <span className={cx('mono muted')}>{copy.role}</span>
        {modal ? <button type="button" className={cx('close')} aria-label={t('closeCase')} data-close-dialog>×</button>
          : <Link href={localizedPath(locale) + '#work'} className={cx('case-back')}>← {t('backWork')}</Link>}
      </div>

      <div className={cx('case-head')}><Heading id="case-title">{copy.title}</Heading><p>{copy.summary}</p></div>

      <div className={cx('case-body')}>
        <div><SectionHeading>{t('caseContribution')}</SectionHeading><p>{copy.contribution}</p></div>
        <div><SectionHeading>{t('caseChanged')}</SectionHeading><p>{copy.result}</p></div>
      </div>

      <div className={cx('case-links')}>
        {project.url && <a className={cx('pill solid')} data-pill href={project.url} target="_blank" rel="noopener noreferrer">
          <span>{t('visitProduct')}</span><span aria-hidden="true">↗</span>
        </a>}
        <Link className={cx('pill')} data-pill href={localizedPath(locale) + '#contact'} replace={modal}>
          <span>{t('similar')}</span><span aria-hidden="true">↗</span>
        </Link>
      </div>
      
      <p className={cx('muted case-note')}>{t('caseNote')}</p>
    </div>
  )
}

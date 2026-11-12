import {getTranslations} from 'next-intl/server';
import {cx, rv} from '@/lib/styles';
import {site} from '@/lib/site';
import {Brief} from './Brief';
import type {Locale} from '@/lib/paths';
import {Icon} from '@/components/Icon';

export async function Contact({locale}: {locale: Locale}) {
  const t = await getTranslations({locale});

  return (
    <section className={cx('contact')} id="contact" aria-labelledby="contact-heading">
      <div className={cx('section-label mono')}>
        <span>{t('contactLabel')}</span><span>07 — NEXT MOVE</span>
      </div>

      <div {...rv('contact-line')}>
        <h2 id="contact-heading">{t.rich('contactHeading', {br: () => <br />, em: (text) => <em>{text}</em>})}</h2>
        <a className={cx('contact-orb')} href={site.telegram} target="_blank"
          rel="noopener noreferrer" data-contact="telegram" aria-label={t('talk') + ' — Telegram'}>
          <Icon name="arrow-up-right" /><small>Telegram</small>
        </a>
      </div>

      {/* <Brief locale={locale} telegram={site.telegram} labels={{
        title: t('bTitle'), typeLabel: t('bTypeLabel'), textLabel: t('bTextLabel'), placeholder: t('bPlaceholder'),
        chips: [t('c1'), t('c2'), t('c3'), t('c4')], tg: t('bTg'), mail: t('bMail'),
        contact: t('bContact'), sending: t('bSending'), sent: t('bSent'), error: t('bError'), invalid: t('bInvalid'),
        greeting: t('bGreeting'), interested: t('bInterested')}} /> */}

      <div {...rv('contacts')}>
        <a className={cx('pill')} data-pill data-magnetic data-contact="email" href={'mailto:' + site.email}>
          <span className={cx('label')} data-magnetic-label>{site.email}</span><Icon name="arrow-up-right" />
        </a>
        <p className={cx('muted contact-copy')}>{t.rich('contactCopy', {br: () => <br />})}</p>
      </div>
      
      <footer className={cx('footer mono')}>
        <span>© {site.year} STANISLAV SINITSYN</span>
        <a href="#main">{t('backTop')} <Icon name="arrow-up" /></a>
      </footer>
    </section>
  )
}

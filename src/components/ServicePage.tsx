import Link from 'next/link';
import {getTranslations} from 'next-intl/server';
import {cx, rv} from '@/lib/styles';
import {localizedPath, type Locale} from '@/lib/paths';
import {Contact} from '@/components/Contact';
import {Fx} from '@/components/Fx';
import {Icon} from '@/components/Icon';
import {StructuredData} from '@/components/StructuredData';
import {WorkScreen} from '@/components/WorkScreen';

export type StackGroup = {label: string; items: readonly string[]};

/**
 * Shared layout of the service pages: hero with the stack on an LCD panel, a list of work types,
 * an optional table of real cases, process steps, FAQ and contact. All copy lives in `messages/*`
 * under `namespace`; the stack names are proper nouns, so only the group labels are translated.
 */
export async function ServicePage({locale, namespace, path, stack, buildCount, showCases}: {
  locale: Locale; namespace: string; path: string; stack: readonly StackGroup[];
  buildCount: number; showCases: boolean;
}) {
  const t = await getTranslations({locale, namespace});
  const rich = (key: string) => t.rich(key, {em: (text) => <em>{text}</em>});
  const range = (n: number) => Array.from({length: n}, (_, i) => i + 1);
  const home = localizedPath(locale);

  return (
    <main id="main" tabIndex={-1}>
      <StructuredData locale={locale}
        servicePage={{path, name: t('crumb'), description: t('description')}} />
      <span data-glow-class={cx('glow')} hidden />
      <Fx />

      <div className={cx('wrap')}>
        <section className={cx('svc-hero')} aria-labelledby="svc-title">
          <nav className={cx('crumbs')} aria-label={t('crumbLabel')}>
            <ol>
              <li><Link href={home}>{t('crumbHome')}</Link></li>
              <li aria-current="page">{t('crumb')}</li>
            </ol>
          </nav>

          <div className={cx('svc-hero-grid')}>
            <div>
              <h1 id="svc-title">{rich('h1')}</h1>
              <p className={cx('intro')}>{t('intro')}</p>
              <div className={cx('hero-actions')}>
                <a className={cx('pill solid')} data-pill href="#contact" data-magnetic>
                  <span className={cx('label')} data-magnetic-label>{t('cta')}</span><Icon name="arrow-up-right" />
                </a>
                <a className={cx('text-link')} href={showCases ? '#work' : '#build'}>{t('secondary')} <Icon name="arrow-down" /></a>
              </div>
            </div>

            <div className={cx('console svc-console')}>
              <div className={cx('console-top mono')}>
                <span>SS—01 / {t('lcd').toUpperCase()}</span>
                <span className={cx('screw')} aria-hidden="true"><Icon name="minus" /></span>
              </div>
              <div className={cx('spec')} role="group" aria-label={t('lcd')}>
                <dl>
                  {stack.map(({label, items}) => <div key={label}>
                    <dt className={cx('mono')}>{t(label)}</dt>
                    <dd>{items.join(' · ')}</dd>
                  </div>)}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section className={cx('section svc-build')} id="build" aria-labelledby="build-heading">
          <div className={cx('svc-build-grid')}>
            <h2 id="build-heading">{t('buildHeading')}</h2>
            <ul className={cx('svc-list')}>
              {range(buildCount).map((n) => <li key={n} {...rv('svc-item', n - 1)}>
                <h3>{t('b' + n)}</h3><p>{t('b' + n + 'p')}</p>
              </li>)}
            </ul>
          </div>
        </section>

        {showCases && <section className={cx('section')} id="work" aria-labelledby="proof-heading">
          <div {...rv('section-heading')}><h2 id="proof-heading">{t('proofHeading')}</h2></div>
          <WorkScreen locale={locale} />
        </section>}

        <section className={cx('section process')} aria-labelledby="process-heading">
          <div {...rv('section-heading')}><h2 id="process-heading">{t('processHeading')}</h2></div>
          <div className={cx('process-grid')}>
            {range(4).map((n) => <article {...rv('step', n - 1)} key={n}>
              <span className={cx('step-num')} data-scramble>0{n}</span><h3>{t('p' + n)}</h3><p>{t('p' + n + 'p')}</p>
            </article>)}
          </div>
        </section>

        <section className={cx('section faq')} aria-labelledby="faq-heading">
          <div {...rv('')}><h2 id="faq-heading">{t('faqHeading')}</h2></div>
          <div>{range(4).map((n) => <details key={n} {...rv('', n)}>
            <summary>{t('q' + n)}</summary><p>{t('a' + n)}</p>
          </details>)}</div>
        </section>

        <Contact locale={locale} />
      </div>
    </main>
  );
}

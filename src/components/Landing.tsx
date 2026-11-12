import Link from 'next/link';
import {Children, type CSSProperties, type ReactNode} from 'react';
import {getTranslations} from 'next-intl/server';
import {GameConsole} from './game/GameConsole';
import {MotionToggle} from './MotionToggle';
import {Contact} from './Contact';
import {Fx} from './Fx';
import {StructuredData} from './StructuredData';
import {projects} from '@/lib/projects';
import {cx, rv} from '@/lib/styles';
import {localizedPath, type Locale} from '@/lib/paths';
import {site} from '@/lib/site';
import {Icon} from '@/components/Icon';

export async function Landing({locale}: {locale: Locale}) {
  const t = await getTranslations({locale});
  const rich = (key: string) => t.rich(key, {br: () => <br />, em: (text) => <em>{text}</em>});
  let wordIndex = 0;
  const words = (chunks: ReactNode): ReactNode[] => (Children.toArray(chunks) as ReactNode[]).flatMap((chunk): ReactNode[] =>
    typeof chunk !== 'string' ? [chunk] : chunk.split(/(\s+)/).filter(Boolean).map((token) =>
      !token.trim() ? token : <span className={cx('w')} key={'w' + wordIndex}>
        <span style={{'--i': wordIndex++} as CSSProperties}>{token}</span></span>));
  const headline = words(t.rich('headline', {br: () => <br />, em: (text) => <em>{words(text)}</em>}));
  const stats = [['6', '', '+', 'st1'], ['8', '', '', 'st2'], ['30', '−', '%', 'st3'], ['30', '', ' s', 'st4']];
  const tags = ['UX / UI / RESPONSIVE DESIGN', 'REACT / VUE / TYPESCRIPT / NODE.JS',
    t('mobileStack'), 'FEATURES / PERFORMANCE / MODERNISATION',
    'QA / DEPLOYMENT / ANALYTICS', 'TECHNICAL SEO / CONTENT / GEO'];

  return (
    <main id="main" tabIndex={-1}>
      <StructuredData locale={locale} />
      <div className={cx('boot')} aria-hidden="true"><div>SS—01 / BOOTING<i>_</i><b /></div></div>
      <span data-glow-class={cx('glow')} hidden />
      <Fx />

      <div className={cx('wrap')}>
        <section className={cx('hero')} aria-labelledby="headline">
          <div className={cx('section-label mono')}><span>{t('heroLabel')}</span><span>01 — INTRO</span></div>
          <div className={cx('hero-grid')}>
            <div>
              <div className={cx('eyebrow mono')}><span className={cx('status-dot')} /><span>{t('eyebrow')}</span></div>
              <h1 id="headline" data-headline>{headline}</h1>
              <p className={cx('intro')}>{t('intro')}</p>
              <div className={cx('hero-actions')}>
                <a className={cx('pill solid')} data-pill href="#contact" data-magnetic>
                  <span className={cx('label')} data-magnetic-label>{t('talk')}</span><Icon name="arrow-up-right" />
                </a>
                <a className={cx('text-link')} href="#work">{t('seeWork')} <Icon name="arrow-down" /></a>
              </div>
              <div className={cx('hero-foot mono')}>
                <span>{t('experience')}</span><span className={cx('rule')} /><span>{t('direct')}</span>
              </div>
            </div>

            <GameConsole portraitAlt={t('portraitAlt')} caption={rich('photoCaption')} />
          </div>
        </section>
      </div>

      <div className={cx('marquee-shell')} aria-hidden="true">
        <div className={cx('marquee')} data-marquee>
          {[0, 1].map((n) => <span key={n}>IDEAS INTO PRODUCTS <b><Icon name="asterisk" /></b> DESIGN INTO CODE <b><Icon name="asterisk" /></b></span>)}
        </div>
      </div>

      <div className={cx('wrap')}>
        <MotionToggle />
        <div className={cx('stats')}>
          {stats.map(([n, pre, suf, key], i) => <div key={key} {...rv('stat', i)}>
            <b data-count={n} data-pre={pre} data-suf={suf}>{pre + n + suf}</b><span>{t(key)}</span>
          </div>)}
        </div>

        <section className={cx('section')} id="work" aria-labelledby="work-heading">
          <div className={cx('section-label mono')}><span>{t('workLabel')}</span><span>02 — WORK</span></div>
          <div {...rv('section-heading')}>
            <h2 id="work-heading">{t('workHeading')}</h2><p>{rich('workIntro')}</p>
          </div>

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
        </section>

        <section className={cx('section services')} id="services" aria-labelledby="services-heading">
          <div className={cx('section-label mono')}><span>{t('servicesLabel')}</span><span>03 — SERVICES</span></div>
          <div {...rv('section-heading')}>
            <h2 id="services-heading">{rich('servicesHeading')}</h2><p>{rich('servicesIntro')}</p>
          </div>

          <div className={cx('service-list')}>
            {tags.map((tag, index) => <article {...rv('service', index)} key={tag}>
              <span className={cx('mono')}>[{String(index + 1).padStart(2, '0')}]</span>
              <div><h3>{t('s' + (index + 1))}</h3><p>{t('s' + (index + 1) + 'p')}</p><small>{tag}</small></div>
            </article>)}
          </div>
        </section>

        <section className={cx('section process')} id="process" aria-labelledby="process-heading">
          <div className={cx('section-label mono')}><span>{t('processLabel')}</span><span>04 — PROCESS</span></div>
          <div {...rv('section-heading')}>
            <h2 id="process-heading">{t('processHeading')}</h2><p>{rich('processIntro')}</p>
          </div>
          <div className={cx('process-grid')}>
            {[1, 2, 3, 4].map((number) => <article {...rv('step', number - 1)} key={number}>
              <span className={cx('step-num')} data-scramble>0{number}</span><h3>{t('p' + number)}</h3><p>{t('p' + number + 'p')}</p>
            </article>)}
          </div>
        </section>

        <section {...rv('about')} id="about" aria-labelledby="about-heading">
          <div><span className={cx('mono muted')}>05 — PLAYER ONE</span>
            <h2 className={cx('about-heading')} id="about-heading">{rich('aboutHeading')}</h2></div>
          <div className={cx('about-copy')}>
            <p>{t('aboutLead')}</p><p>{t('aboutBody')}</p>
            <div className={cx('stack mono')}>{site.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          </div>
        </section>
        
        <section className={cx('section faq')} aria-labelledby="faq-heading">
          <div {...rv('')}><span className={cx('mono muted')}>06 — BEFORE WE START</span><h2 id="faq-heading">{rich('faqHeading')}</h2></div>
          <div>{[1, 2, 3, 4].map((number) => <details key={number} {...rv('', number)}>
            <summary>{t('q' + number)}</summary><p>{t('a' + number)}</p>
          </details>)}</div>
        </section>
        <Contact locale={locale} />
      </div>
    </main>
  )
}

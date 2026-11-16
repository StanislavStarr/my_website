import {readFile} from 'node:fs/promises';
import {ImageResponse} from 'next/og';
import type {Locale} from './paths';

const copy = {
  en: {top: 'STANISLAV SINITSYN · WEB / MOBILE', line1: 'From idea to a', line2: 'working product.',
    bottom: 'Design · Development · Launch', size: 90},
  ru: {top: 'СТАНИСЛАВ СИНИЦЫН · ВЕБ / МОБИЛЬНЫЕ', line1: 'От идеи до', line2: 'работающего продукта.',
    bottom: 'Дизайн · Разработка · Запуск', size: 78}
} as const;

// next/og has no Cyrillic glyphs of its own, so both languages use the site's Geologica files.
const font = (name: string) => readFile(new URL('../assets/fonts/' + name, import.meta.url));

export async function renderOgImage(locale: Locale) {
  const t = copy[locale];
  const [regular, semibold] = await Promise.all([font('Geologica-Regular.ttf'), font('Geologica-SemiBold.ttf')]);

  return new ImageResponse(
    <div style={{background: '#181612', color: '#f0e8da', width: '100%', height: '100%', fontFamily: 'Geologica',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 70}}>
      <div style={{fontSize: 27, color: '#b5aa98', display: 'flex'}}>{t.top}</div>
      <div style={{fontSize: t.size, fontWeight: 600, lineHeight: 1.05, letterSpacing: -3, display: 'flex', flexDirection: 'column'}}>
        <span>{t.line1}</span><span style={{color: '#e5a353'}}>{t.line2}</span>
      </div>
      <div style={{fontSize: 25, display: 'flex'}}>{t.bottom}</div>
    </div>,
    {width: 1200, height: 630, fonts: [
      {name: 'Geologica', data: regular, weight: 400, style: 'normal'},
      {name: 'Geologica', data: semibold, weight: 600, style: 'normal'}
    ]}
  );
}

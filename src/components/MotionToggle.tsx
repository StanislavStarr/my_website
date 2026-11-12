'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {cx} from '@/lib/styles';
import {Icon} from '@/components/Icon';

export function MotionToggle() {
  const t = useTranslations('motion');
  const [off, setOff] = useState(false);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    
    const stored = () => {try {return localStorage.getItem('portfolio-motion');} catch {return null;}};
    const sync = () => setOff(media.matches || stored() === 'off');
    sync();
    media.addEventListener('change', sync);

    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = document.body.dataset.motion = off ? 'off' : 'on';
    window.dispatchEvent(new Event('portfolio:motion'));
  }, [off]);

  return (
    <button type="button" className={cx('motion-toggle mono')} aria-pressed={off}
      onClick={() => {
        const next = !off;
        setOff(next);
        try {localStorage.setItem('portfolio-motion', next ? 'off' : 'on');} catch {}
      }}
    >
      <Icon name={off ? 'play' : 'pause'} />{t(off ? 'resume' : 'pause')}
    </button>
  )
}

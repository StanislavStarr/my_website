'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import {useState, type ReactNode} from 'react';
import {useTranslations} from 'next-intl';
import {cx} from '@/lib/styles';

const SnakeGame = dynamic(() => import('./SnakeGame'), {ssr: false, loading: () => <GameLoading />});

function GameLoading() {
  const t = useTranslations('game');
  return <div className={cx('game-loading')} role="status">{t('loading')}</div>;
}

export function GameConsole({portraitAlt, caption}: {portraitAlt: string; caption: ReactNode}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('game');

  return (
    <div className={cx('console')} data-console>
      <div className={cx('console-top mono')}><span>SS—01 / PLAYER ONE</span><span className={cx('screw')} aria-hidden="true">−</span></div>
      <div className={cx('portrait-screen')}>
        <div className={cx('portrait-view')} hidden={open}>
          <Image className={cx('portrait')} src="/images/portrait.png" alt={portraitAlt}
            width={1086} height={1448} preload
            sizes="(max-width: 650px) 90vw, (max-width: 1440px) 42vw, 560px" />
            
          <div className={cx('photo-caption')}>
            <span className={cx('name')}>Stanislav<br />Sinitsyn</span><span className={cx('mono')}>{caption}</span>
          </div>
        </div>
        {open && <SnakeGame />}
      </div>

      <div className={cx('console-bottom')}>
        <span className={cx('speaker')} aria-hidden="true" />
        <div className={cx('play-label')}><strong>{t(open ? 'openCopy' : 'playCopy')}</strong>
          <small>{t(open ? 'openSub' : 'playSub')}</small></div>
        <button type="button" className={cx('play')} aria-label={t(open ? 'close' : 'open')}
          aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '×' : '▶'}</button>
      </div>
    </div>
  )
}

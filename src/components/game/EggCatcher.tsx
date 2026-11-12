'use client';

import {useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {cx} from '@/lib/styles';
import {createRound, stepRound, eggPosition, ROUND_MS, type Lane} from './engine';

const arrows = ['↖', '↗', '↙', '↘'];
const laneLabels = ['upperLeft', 'upperRight', 'lowerLeft', 'lowerRight'];
const keys: Record<string, Lane> = {q: 0, e: 1, a: 2, d: 3, '7': 0, '9': 1, '1': 2, '3': 3};
const codes: Record<string, Lane> = {KeyQ: 0, KeyE: 1, KeyA: 2, KeyD: 3};

export default function EggCatcher() {
  const t = useTranslations('game');
  const [round, setRound] = useState(() => createRound());
  const state = useRef(round);
  const startButton = useRef<HTMLButtonElement>(null);
  const firstLane = useRef<HTMLButtonElement>(null);
  const x = round.lane % 2 ? 234 : 126;
  const y = round.lane < 2 ? 89 : 157;

  const updateLane = (lane: Lane) => {
    state.current = {...state.current, lane};
    setRound(state.current);
  };

  useEffect(() => {
    if (round.phase === 'finished') startButton.current?.focus();
    if (round.phase !== 'running') return;

    let animation = 0;
    let last = performance.now();
    const frame = (now: number) => {
      state.current = stepRound(state.current, now - last);
      last = now;
      setRound(state.current);
      if (state.current.phase === 'running') animation = requestAnimationFrame(frame);
    };

    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animation);
        state.current = {...state.current, phase: 'finished'};
        setRound(state.current);
      }
    };

    animation = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', visibility);

    return () => {
      cancelAnimationFrame(animation);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [round.phase]);

  return (
    <div className={cx('game')} tabIndex={0} role="group" aria-label={t('field')} aria-describedby="game-hint game-keys"
      onKeyDown={(event) => {
        const lane = keys[event.key.toLowerCase()] ?? codes[event.code];
        if (lane !== undefined) {event.preventDefault(); updateLane(lane);}
      }}
    >
      <div className={cx('game-top')}>
        <span>{t('score')} <b>{String(round.score).padStart(3, '0')}</b></span>
        <span>{Math.max(0, Math.ceil((ROUND_MS - round.elapsed) / 1000))}{t('seconds')}</span>
        <span>{t('miss')} <b>{round.misses}/3</b></span>
      </div>

      <svg viewBox="0 0 360 210" role="img" aria-label={t('field')}>
        <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M0 22H31V36L127 83M0 98H31V109L127 151M360 22H329V36L233 83M360 98H329V109L233 151" />
          <path d="M0 30H25M0 106H25M335 30H360M335 106H360" strokeWidth="7" />
          <path d="M2 190H358" strokeWidth="1" opacity=".35" />
        </g>

        <g className={cx('ghost')} fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="49" cy="40" rx="4" ry="6" transform="rotate(-55 49 40)" />
          <ellipse cx="70" cy="50" rx="4" ry="6" transform="rotate(-55 70 50)" />
          <ellipse cx="92" cy="61" rx="4" ry="6" transform="rotate(-55 92 61)" />
          <ellipse cx="311" cy="115" rx="4" ry="6" transform="rotate(55 311 115)" />
          <ellipse cx="290" cy="125" rx="4" ry="6" transform="rotate(55 290 125)" />
        </g>

        <g fill="currentColor">
          <path d="M166 105L156 82L159 55L174 68L190 62L201 41L204 74L225 82L214 92L195 97L196 116L207 150L200 173L218 184L216 190H185L177 166L171 190H144L145 182L158 170L153 142Z" />
          <path d="M157 139Q129 126 142 106Q124 115 128 138L154 160Z" />
        </g>

        <path d="M179 80H185" stroke="var(--lcd)" strokeWidth="3" />
        <path d="M190 105L203 110L194 119L183 113Z" fill="var(--lcd)" />

        <g fill="none" stroke="currentColor" strokeWidth="3">
          <path d={'M178 122L' + (178 + x) / 2 + ' ' + ((122 + y) / 2 + 4) + 'L' + x + ' ' + (y + 5)} />
          <path d={'M' + (x - 17) + ' ' + y + 'Q' + x + ' ' + (y + 27) + ' ' + (x + 17) + ' ' + y + 'M' + (x - 17) + ' ' + y + 'H' + (x + 17)} />
          <path d={'M' + (x - 10) + ' ' + (y + 6) + 'H' + (x + 10)} strokeWidth="1" />
        </g>

        <g fill="var(--lcd)" stroke="currentColor" strokeWidth="2.5">
          {round.eggs.map((egg) => {
            const {x, y, rotation} = eggPosition(egg);
            return <ellipse key={egg.id} cx={x} cy={y} rx="5" ry="7"
              transform={'rotate(' + rotation + ' ' + x + ' ' + y + ')'} />;
          })}
        </g>
      </svg>

      <p id="game-hint" className={cx('game-msg')}>{t('hint')}</p>
      <span id="game-keys" className={cx('game-sr')}>{t('keys')}</span>
      <div className={cx('game-controls')}>
        {arrows.map((arrow, lane) => <button key={lane} type="button" ref={lane === 0 ? firstLane : undefined}
          aria-label={t(laneLabels[lane])} aria-pressed={round.lane === lane}
          onPointerDown={() => updateLane(lane as Lane)} onClick={() => updateLane(lane as Lane)}>
          {arrow}
        </button>)}
      </div>

      {round.phase !== 'running' && <div className={cx('game-start')}><div>
        {round.phase === 'finished' && <span className={cx('game-end')}>{t('score')} {String(round.score).padStart(3, '0')}</span>}

        <button ref={startButton} type="button" onClick={() => {
          state.current = createRound('running');
          setRound(state.current);
          firstLane.current?.focus();
        }}>{t(round.phase === 'finished' ? 'again' : 'start')}</button>

      </div></div>}

      <span className={cx('game-sr')} role="status" aria-live="polite">
        {round.phase === 'finished' ? t('finished', {score: round.score}) : ''}
      </span>
    </div>
  )
}

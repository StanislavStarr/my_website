'use client';

import {useEffect, useRef, useState, type KeyboardEvent, type PointerEvent} from 'react';
import {useTranslations} from 'next-intl';
import {cx} from '@/lib/styles';
import {Icon, type IconName} from '@/components/Icon';
import {COLS, ROWS, createGame, step, tickMs, turn, type Dir} from './engine';

const CELL = 20;
const pad: Array<[Dir, IconName, string]> = [
  ['up', 'arrow-up', 'padUp'], ['left', 'arrow-left', 'padLeft'], ['down', 'arrow-down', 'padDown'], ['right', 'arrow-right', 'padRight']
];
const keys: Record<string, Dir> = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right'
};

export default function SnakeGame() {
  const t = useTranslations('game');
  const [game, setGame] = useState(() => createGame());
  const state = useRef(game);
  const root = useRef<HTMLDivElement>(null);
  const swipe = useRef<{x: number; y: number} | null>(null);

  const update = (next: typeof game) => {state.current = next; setGame(next);};
  const start = () => {update(createGame('running')); root.current?.focus();};

  useEffect(() => {root.current?.focus();}, []);

  useEffect(() => {
    if (game.phase !== 'running') return;
    let frame = 0, last = performance.now(), acc = 0;
    const loop = (now: number) => {
      acc += Math.min(now - last, 250); // a background tab must not cause a jump
      last = now;
      let next = state.current;
      while (acc >= tickMs(next.score) && next.phase === 'running') {
        acc -= tickMs(next.score);
        next = step(next);
      }
      if (next !== state.current) update(next);
      if (next.phase === 'running') frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [game.phase]);

  const steer = (dir: Dir) => {
    if (state.current.phase === 'ready') update({...createGame('running'), next: dir === 'left' ? 'right' : dir});
    else update(turn(state.current, dir));
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const dir = keys[event.key];
    if (dir) {event.preventDefault(); if (state.current.phase !== 'finished') steer(dir);}
    else if (event.key === ' ' && state.current.phase === 'finished') {event.preventDefault(); start();}
  };

  // Touch screens have no arrow keys, so a swipe steers as well.
  const onPointerUp = (event: PointerEvent) => {
    const from = swipe.current; swipe.current = null;
    if (!from || event.pointerType === 'mouse' || state.current.phase === 'finished') return;
    const dx = event.clientX - from.x, dy = event.clientY - from.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  };

  const score = String(game.score).padStart(3, '0');

  return (
    <div ref={root} className={cx('snake')} tabIndex={0} role="group" aria-label={t('field')}
      aria-describedby="game-hint" onKeyDown={onKeyDown}
      onPointerDown={(e) => {swipe.current = {x: e.clientX, y: e.clientY};}} onPointerUp={onPointerUp}>
      <div className={cx('snake-field')}>
      <svg viewBox={'-4 -4 ' + (COLS * CELL + 8) + ' ' + (ROWS * CELL + 8)} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <pattern id="snake-bg" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
            <rect width={CELL} height={CELL} fill="#7f9573" />
            <rect x="1" y="1" width="18" height="18" fill="none" stroke="#899d78" strokeWidth="2" />
            <rect x="5" y="5" width="10" height="10" fill="none" stroke="#73896c" strokeWidth="2" />
            <rect x="8" y="8" width="4" height="4" fill="#79906f" />
          </pattern>
          <symbol id="snake-cell" viewBox="0 0 20 20">
            <rect width="20" height="20" fill="#0c0d09" />
            <rect x="4" y="4" width="12" height="12" fill="#9aa986" />
            <rect x="6.5" y="6.5" width="7" height="7" fill="#0c0d09" />
          </symbol>
        </defs>
        <rect width={COLS * CELL} height={ROWS * CELL} fill="url(#snake-bg)" />
        <rect x="-1" y="-1" width={COLS * CELL + 2} height={ROWS * CELL + 2} fill="none" stroke="#0c0d09" strokeWidth="2" />
        <g transform={'translate(' + game.food.x * CELL + ' ' + game.food.y * CELL + ')'}>
          <rect width="20" height="20" fill="#8b3a35" />
          <rect x="4" y="4" width="12" height="12" fill="#9aa986" />
          <rect x="6.5" y="6.5" width="7" height="7" fill="#8b3a35" />
        </g>
        {game.snake.map((s, i) => <use key={i} href="#snake-cell" x={s.x * CELL} y={s.y * CELL} width={CELL} height={CELL} />)}
      </svg>

      <div className={cx('snake-score mono')} aria-hidden="true">{t('score')} {score}</div>

      {game.phase !== 'running' && <div className={cx('snake-start')}><div>
        {game.phase === 'finished' && <span className={cx('snake-end')}>{t('score')} {score}</span>}
        <button type="button" onClick={start} autoFocus={game.phase === 'finished'}>
          {t(game.phase === 'finished' ? 'again' : 'start')}</button>
        <p id="game-hint">{t('hint')}</p>
      </div></div>}

      </div>

      <div className={cx('snake-pad')}>
        {pad.map(([dir, icon, label]) => <button key={dir} type="button" className={cx('pad-' + dir)}
          aria-label={t(label)} tabIndex={-1}
          onPointerDown={(e) => {e.preventDefault(); steer(dir);}}><Icon name={icon} /></button>)}
      </div>

      <span className={cx('game-sr')} role="status" aria-live="polite">
        {game.phase === 'finished' ? t('finished', {score: game.score}) : ''}
      </span>
    </div>
  );
}

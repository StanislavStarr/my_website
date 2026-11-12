'use client';

import {useEffect, useRef} from 'react';
import {useRouter} from 'next/navigation';
import {cx} from '@/lib/styles';

// Progressive enhancements: normal links and all content also work without JS.
export function Enhancements() {
  const router = useRouter();
  const curtain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let navigationTimer: ReturnType<typeof setTimeout> | undefined;
    let animationTimer: ReturnType<typeof setTimeout> | undefined;
    let activeMagnet: HTMLElement | null = null;
    let busy = false;

    const reduced = () => document.body.dataset.motion === 'off' ||
      matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resetMagnet = () => {
      if (!activeMagnet) return;
      activeMagnet.style.transform = '';
      const label = activeMagnet.querySelector<HTMLElement>('[data-magnetic-label]');
      if (label) label.style.transform = '';
      activeMagnet = null;
    };

    const move = (event: PointerEvent) => {
      if (reduced() || !matchMedia('(pointer: fine)').matches) {resetMagnet(); return;}
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>('[data-magnetic]') : null;
      if (target !== activeMagnet) resetMagnet();
      if (!target) return;

      activeMagnet = target;
      const r = target.getBoundingClientRect();
      const x = (event.clientX - r.left - r.width / 2) * .14;
      const y = (event.clientY - r.top - r.height / 2) * .23;
      target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      const label = target.querySelector<HTMLElement>('[data-magnetic-label]');

      if (label) label.style.transform = 'translate(' + x * .4 + 'px,' + y * .4 + 'px)';
    };

    // White fill grows from (and retreats to) the pointer position on pills.
    const pillAt = (event: PointerEvent) => {
      const pill = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-pill]') : null;
      if (!pill || (event.relatedTarget instanceof Node && pill.contains(event.relatedTarget))) return;
      const r = pill.getBoundingClientRect();
      const x = event.clientX - r.left, y = event.clientY - r.top;
      const far = Math.max(Math.hypot(x, y), Math.hypot(r.width - x, y),
        Math.hypot(x, r.height - y), Math.hypot(r.width - x, r.height - y));
      pill.style.setProperty('--mx', x + 'px');
      pill.style.setProperty('--my', y + 'px');
      pill.style.setProperty('--r', far * 2 + 2 + 'px');
    };

    const click = (event: MouseEvent) => {
      const anchor = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('a') : null;

      if (!anchor) return;

      if (anchor.dataset.contact) {
        window.dispatchEvent(new CustomEvent('portfolio:contact', {detail: {
          channel: anchor.dataset.contact,
          path: location.pathname,
          locale: document.documentElement.lang
        }}));
      }

      if (!anchor.hasAttribute('data-transition') || reduced() || event.defaultPrevented ||
          event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      event.preventDefault();

      if (busy) return;
      busy = true;
      const panel = curtain.current;
      panel?.classList.add(cx('run'));
      navigationTimer = setTimeout(() => router.push(url.pathname + url.search + url.hash), 210);
      animationTimer = setTimeout(() => {
        panel?.classList.remove(cx('run'));
        busy = false;
      }, 700);
    };

    document.addEventListener('pointermove', move, {passive: true});
    document.addEventListener('pointerover', pillAt, {passive: true});
    document.addEventListener('pointerout', pillAt, {passive: true});
    document.addEventListener('pointerleave', resetMagnet);
    document.addEventListener('click', click, true);
    window.addEventListener('portfolio:motion', resetMagnet);
    
    return () => {
      clearTimeout(navigationTimer);
      clearTimeout(animationTimer);
      resetMagnet();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', pillAt);
      document.removeEventListener('pointerout', pillAt);
      document.removeEventListener('pointerleave', resetMagnet);
      document.removeEventListener('click', click, true);
      window.removeEventListener('portfolio:motion', resetMagnet);
    };
  }, [router]);

  return (
    <div className={cx('curtain')} ref={curtain} aria-hidden="true" />
  )
}

'use client';

import {useEffect} from 'react';

export function Fx() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(pointer: fine)').matches;
    const motionOff = () => document.body.dataset.motion === 'off';
    const cleanups: Array<() => void> = [];

    const h1 = document.querySelector<HTMLElement>('[data-headline]');
    const goTimer = setTimeout(() => h1?.setAttribute('data-go', ''), reduced ? 0 : 1000);
    cleanups.push(() => {clearTimeout(goTimer); h1?.removeAttribute('data-go');});

    if (!reduced) {
      root.dataset.fx = 'on';
      cleanups.push(() => {delete root.dataset.fx;});

      const counters = [...document.querySelectorAll<HTMLElement>('[data-count]')];
      const finals = counters.map((el) => el.textContent ?? '');
      const label = (el: HTMLElement, n: number) => (el.dataset.pre ?? '') + n + (el.dataset.suf ?? '');
      counters.forEach((el) => {el.textContent = label(el, 0);});
      cleanups.push(() => counters.forEach((el, i) => {el.textContent = finals[i];}));

      let alive = true;
      cleanups.push(() => {alive = false;});

      const count = (el: HTMLElement) => {
        const n = Number(el.dataset.count);
        if (motionOff()) {el.textContent = label(el, n); return;}
        const t0 = performance.now();
        const step = (t: number) => {
          if (!alive) return;
          const k = Math.min(1, (t - t0) / 1300);
          el.textContent = label(el, Math.round(n * (1 - Math.pow(1 - k, 4))));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      };

      const scramble = (el: HTMLElement) => {
        if (motionOff()) return;
        const final = el.textContent ?? '';
        let k = 0;
        const id = setInterval(() => {
          el.textContent = final.replace(/\d/g, () => String(Math.floor(Math.random() * 10)));
          if (++k > 14 || !alive) {clearInterval(id); el.textContent = final;}
        }, 45);
      };

      const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        el.setAttribute('data-in', '');
        io.unobserve(el);
        const num = el.querySelector<HTMLElement>('[data-scramble]');
        if (num) scramble(num);
        const stat = el.matches('[data-count]') ? el : el.querySelector<HTMLElement>('[data-count]');
        if (stat) count(stat);
      }), {threshold: .15, rootMargin: '0px 0px -6% 0px'});
      document.querySelectorAll('[data-rv]').forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());

      const marquee = document.querySelector<HTMLElement>('[data-marquee]');
      const anim = marquee?.getAnimations()[0];
      const consoleEl = document.querySelector<HTMLElement>('[data-console]');
      let glow: HTMLDivElement | null = null;
      let tx = innerWidth / 2, ty = 300, gx = tx, gy = ty, ly = scrollY, v = 0, raf = 0;

      if (fine) {
        glow = document.createElement('div');
        glow.className = document.querySelector<HTMLElement>('[data-glow-class]')?.dataset.glowClass ?? '';
        document.body.appendChild(glow);
        const onMove = (e: PointerEvent) => {tx = e.clientX; ty = e.clientY;};
        addEventListener('pointermove', onMove, {passive: true});
        cleanups.push(() => {removeEventListener('pointermove', onMove); glow?.remove();});

        if (consoleEl) {
          const tilt = (e: PointerEvent) => {
            if (motionOff()) return;
            const r = consoleEl.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
            consoleEl.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
          };
          const reset = () => {consoleEl.style.transform = '';};
          consoleEl.addEventListener('pointermove', tilt);
          consoleEl.addEventListener('pointerleave', reset);
          cleanups.push(() => {
            consoleEl.removeEventListener('pointermove', tilt);
            consoleEl.removeEventListener('pointerleave', reset);
            reset();
          });
        }
      }

      const tick = () => {
        if (glow) {
          gx += (tx - gx) * .12; gy += (ty - gy) * .12;
          glow.style.transform = `translate(${gx}px,${gy}px)`;
        }
        const y = scrollY;
        v += ((y - ly) - v) * .12; ly = y;
        if (anim && !motionOff()) anim.playbackRate = Math.max(-6, Math.min(8, 1 + v * .18));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      cleanups.push(() => cancelAnimationFrame(raf));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}

'use client';

import {useEffect, useRef, type ReactNode} from 'react';
import {useRouter} from 'next/navigation';
import {cx} from '@/lib/styles';

export function CaseDialog({children}: {children: ReactNode}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    const dialog = ref.current;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let locked = false;
    const saved = {overflow: '', paddingRight: ''};

    const open = () => {
      if (!dialog || dialog.open) return;
      dialog.showModal();

      saved.overflow = document.body.style.overflow;
      saved.paddingRight = document.body.style.paddingRight;
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbar > 0) document.body.style.paddingRight = scrollbar + 'px';
      locked = true;

      const curtain = document.querySelector<HTMLElement>('[data-curtain]');
      if (curtain?.matches(':popover-open')) {
        const time = curtain.getAnimations()[0]?.currentTime ?? null;
        curtain.hidePopover();
        curtain.showPopover();
        const animation = curtain.getAnimations()[0];
        if (animation && time !== null) animation.currentTime = time;
      }
    };

    const curtain = document.querySelector<HTMLElement>('[data-curtain]');
    const animation = curtain?.matches(':popover-open') ? curtain.getAnimations()[0] : undefined;
    const duration = Number(animation?.effect?.getComputedTiming().duration ?? 0);
    const elapsed = Number(animation?.currentTime ?? 0);
    const wait = animation ? Math.max(0, duration * 0.45 - elapsed) : 0;
    if (wait > 0) timer = setTimeout(open, wait);
    else open();

    return () => {
      clearTimeout(timer);
      if (locked) {
        document.body.style.overflow = saved.overflow;
        document.body.style.paddingRight = saved.paddingRight;
      }
    };
  }, []);

  return (
    <dialog ref={ref} className={cx('case-dialog')} aria-labelledby="case-title"
      onClose={() => router.back()}
      onClick={(event) => {
        const dialog = ref.current;
        if (!dialog) return;
        const target = event.target;
        if (target instanceof Element && target.closest('[data-close-dialog]')) {
          dialog.close();
        } else if (target === dialog) {
          const r = dialog.getBoundingClientRect();
          if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
        }
      }}
    >
      {children}
    </dialog>
  )
}

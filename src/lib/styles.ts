import type {CSSProperties} from 'react';
import styles from '@/styles/site.module.css';

export function cx(...names: string[]) {
  return names.flatMap((name) => name.split(' ')).filter(Boolean)
    .map((name) => styles[name] ?? name).join(' ');
}

// Scroll-reveal props; the Fx component toggles data-in when the element enters the viewport.
export function rv(names: string, index = 0) {
  return {className: cx(names + ' rv'), 'data-rv': '',
    style: {'--d': Math.min(index, 6)} as CSSProperties};
}

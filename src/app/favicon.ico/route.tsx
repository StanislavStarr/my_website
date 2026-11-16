import {ImageResponse} from 'next/og';

export const dynamic = 'force-static';

/** Fallback for crawlers and browsers that request /favicon.ico directly. Same mark as icon.svg. */
export function GET() {
  return new ImageResponse(
    <div style={{width: '100%', height: '100%', display: 'flex', background: '#181612', borderRadius: 7}}>
      <svg width="48" height="48" viewBox="0 0 64 64">
        <path d="M14 14H28V22H36V14H50V34H39V50H25V34H14Z" fill="#e5a353" />
      </svg>
    </div>,
    {width: 48, height: 48}
  );
}

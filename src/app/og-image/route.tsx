import {ImageResponse} from 'next/og';

export const dynamic = 'force-static';

export function GET() {
  return new ImageResponse(
    <div style={{background: '#181612', color: '#f0e8da', width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 70}}>
      <div style={{fontSize: 27, color: '#b5aa98', display: 'flex'}}>STANISLAV SINITSYN · WEB / MOBILE</div>
      <div style={{fontSize: 90, lineHeight: 1, letterSpacing: -5, display: 'flex', flexDirection: 'column'}}>
        <span>From idea to a</span><span style={{color: '#e5a353'}}>working product.</span>
      </div>
      <div style={{fontSize: 25, display: 'flex'}}>Design · Development · Launch</div>
    </div>,
    {width: 1200, height: 630}
  );
}

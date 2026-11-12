import {site} from '@/lib/site';

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const MAX_HITS = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_HITS;
}

const json = (body: object, status = 200) => Response.json(body, {status});

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {data = await request.json();} catch {return json({error: 'bad_request'}, 400);}

  // Honeypot: real visitors never fill this hidden field.
  if (typeof data.website === 'string' && data.website) return json({ok: true});

  const text = (key: string, max: number) => typeof data[key] === 'string' ? (data[key] as string).trim().slice(0, max) : '';
  const message = text('message', 2000);
  const contact = text('contact', 200);
  const topics = text('topics', 300);
  const locale = text('locale', 5);
  if (message.length < 5 || contact.length < 3) return json({error: 'invalid'}, 422);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (limited(ip)) return json({error: 'rate_limited'}, 429);

  const key = process.env.RESEND_API_KEY;
  if (!key) return json({error: 'not_configured'}, 503);

  const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? contact : undefined;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {Authorization: 'Bearer ' + key, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO || site.email],
      subject: 'Заявка с сайта' + (topics ? ': ' + topics : ''),
      text: ['Контакт: ' + contact, topics && 'Тип: ' + topics, 'Язык: ' + locale, '', message].filter((l) => l !== '').join('\n'),
      ...(replyTo && {reply_to: replyTo})
    })
  }).catch(() => null);

  if (!response?.ok) return json({error: 'send_failed'}, 502);
  return json({ok: true});
}

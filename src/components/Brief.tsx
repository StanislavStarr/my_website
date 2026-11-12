'use client';

import {useState, type CSSProperties, type FormEvent} from 'react';
import {cx} from '@/lib/styles';
import {Icon} from '@/components/Icon';

type Props = {
  locale: string; telegram: string;
  labels: {title: string; typeLabel: string; textLabel: string; placeholder: string; chips: string[];
    tg: string; mail: string; greeting: string; interested: string; contact: string;
    sending: string; sent: string; error: string; invalid: string};
};

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'invalid';

export function Brief({locale, telegram, labels}: Props) {
  const [picked, setPicked] = useState<number[]>([]);
  const [text, setText] = useState('');
  const [contact, setContact] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const chosen = picked.map((i) => labels.chips[i]).join(', ');
  const message = labels.greeting + ' ' + (chosen ? labels.interested + ' ' + chosen + '. ' : '') + text.trim();
  const tgHref = telegram + '?text=' + encodeURIComponent(message);
  const toggle = (i: number) => setPicked((p) => p.includes(i) ? p.filter((x) => x !== i) : [...p, i]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === 'sending') return;
    if (text.trim().length < 5 || contact.trim().length < 3) {setStatus('invalid'); return;}
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({message: text, contact, topics: chosen, website, locale})
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus('sent');
      setText('');
    } catch {
      setStatus('error');
    }
  }

  const note = {idle: '', sending: labels.sending, sent: labels.sent, error: labels.error, invalid: labels.invalid}[status];

  return (
    <form className={cx('brief rv')} data-rv="" style={{'--d': 0} as CSSProperties} onSubmit={submit} noValidate>
      <span className={cx('mono muted')}>{labels.title}</span>
      <div className={cx('chips')} role="group" aria-label={labels.typeLabel}>
        {labels.chips.map((chip, i) => <button type="button" key={chip} className={cx('chip')}
          aria-pressed={picked.includes(i)} onClick={() => toggle(i)}>{chip}</button>)}
      </div>
      <textarea rows={3} aria-label={labels.textLabel} placeholder={labels.placeholder}
        value={text} onChange={(e) => {setText(e.target.value); if (status !== 'sending') setStatus('idle');}} />
      <input type="text" className={cx('field')} aria-label={labels.contact} placeholder={labels.contact}
        autoComplete="email" value={contact} onChange={(e) => {setContact(e.target.value); if (status !== 'sending') setStatus('idle');}} />
      <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)}
        className={cx('hp')} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className={cx('brief-actions')}>
        <a className={cx('pill solid')} data-pill data-magnetic data-contact="telegram" href={tgHref}
          target="_blank" rel="noopener noreferrer">
          <span className={cx('label')} data-magnetic-label>{labels.tg}</span><Icon name="arrow-up-right" />
        </a>
        <button type="submit" className={cx('pill')} data-pill data-magnetic data-contact="email"
          disabled={status === 'sending'}>
          <span className={cx('label')} data-magnetic-label>{labels.mail}</span><Icon name="arrow-up-right" />
        </button>
      </div>
      <p className={cx('brief-note mono')} role="status" aria-live="polite" data-state={status}>{note}</p>
    </form>
  );
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {localizedPath, unlocalizedPath} from '../src/lib/paths.ts';
import {getSiteOrigin, canIndex, pageMetadata} from '../src/lib/seo.ts';
import {createGame, step, turn, COLS, ROWS} from '../src/components/game/engine.ts';

test('language routing preserves the current case and keeps EN unprefixed', () => {
  assert.equal(localizedPath('en'), '/');
  assert.equal(localizedPath('ru'), '/ru');
  assert.equal(localizedPath('ru', unlocalizedPath('/work/medtech')), '/ru/work/medtech');
  assert.equal(localizedPath('en', unlocalizedPath('/ru/work/medtech')), '/work/medtech');
  assert.equal(unlocalizedPath('/russian'), '/russian');
});

test('indexing requires a real configured origin and explicit opt-in', () => {
  assert.equal(getSiteOrigin(''), undefined);
  assert.equal(getSiteOrigin('invalid'), undefined);
  assert.equal(getSiteOrigin('https://user:pass@example.com'), undefined);
  assert.equal(getSiteOrigin('https://example.com/subpath'), undefined);
  assert.equal(getSiteOrigin('https://example.com/'), 'https://example.com');
  assert.equal(canIndex(undefined, 'true'), false);
  assert.equal(canIndex('https://localhost', 'true'), false);
  assert.equal(canIndex('http://example.com', 'true'), false);
  assert.equal(canIndex('https://example.com', 'false'), false);
  assert.equal(canIndex('https://example.com', 'true'), true);
});

test('canonical and hreflang point to equivalent case pages', () => {
  const metadata = pageMetadata({locale: 'ru', path: '/work/medtech',
    title: 'MedTech', description: 'Case study', origin: 'https://example.com', indexing: 'true'});
  assert.equal(metadata.alternates?.canonical, 'https://example.com/ru/work/medtech');
  assert.deepEqual(metadata.alternates?.languages, {
    en: 'https://example.com/work/medtech',
    ru: 'https://example.com/ru/work/medtech',
    'x-default': 'https://example.com/work/medtech'
  });
  assert.deepEqual(metadata.robots, {index: true, follow: true});
});

test('snake moves, grows on food and never spawns food on its body', () => {
  const game = createGame('running', () => 0);
  const head = game.snake[0];
  const moved = step(game);
  assert.deepEqual(moved.snake[0], {x: head.x + 1, y: head.y});
  assert.equal(moved.snake.length, 3);
  const fed = step({...game, food: {x: head.x + 1, y: head.y}}, () => 0);
  assert.equal(fed.snake.length, 4);
  assert.equal(fed.score, 1);
  assert.ok(!fed.snake.some((s) => s.x === fed.food.x && s.y === fed.food.y));
  assert.equal(game.snake.length, 3, 'input state is not mutated');
});

test('snake ignores a reversal and wraps through walls', () => {
  const game = createGame('running');
  assert.equal(turn(game, 'left'), game, 'cannot reverse into the neck');
  assert.equal(turn(game, 'up').next, 'up');
  const edge = {...game, snake: [{x: COLS - 1, y: 3}, {x: COLS - 2, y: 3}, {x: COLS - 3, y: 3}]};
  assert.deepEqual(step(edge).snake[0], {x: 0, y: 3});
  const top = {...game, next: 'up' as const, snake: [{x: 4, y: 0}, {x: 4, y: 1}, {x: 4, y: 2}], dir: 'up' as const};
  assert.deepEqual(step(top).snake[0], {x: 4, y: ROWS - 1});
});

test('touching its own body ends the game, then it stops advancing', () => {
  const coil = {...createGame('running'), dir: 'up' as const, next: 'left' as const,
    snake: [{x: 5, y: 5}, {x: 5, y: 4}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 4, y: 6}], food: {x: 0, y: 0}};
  const ended = step(coil);
  assert.equal(ended.phase, 'finished');
  assert.equal(step(ended), ended);
  const chase = {...coil, next: 'up' as const, dir: 'right' as const,
    snake: [{x: 5, y: 5}, {x: 5, y: 6}, {x: 6, y: 6}, {x: 6, y: 5}]};
  assert.equal(step({...chase, next: 'right'}).phase, 'running', 'the vacated tail cell is safe');
});

test('both languages have matching content keys and all four cases', () => {
  const read = (file: string) => JSON.parse(readFileSync(new URL(file, import.meta.url), 'utf8'));
  const keys = (value: Record<string, unknown>, prefix = ''): string[] =>
    Object.entries(value).flatMap(([key, val]) => val && typeof val === 'object'
      ? keys(val as Record<string, unknown>, prefix + key + '.')
      : [prefix + key]).sort();
  assert.deepEqual(keys(read('../messages/en.json')), keys(read('../messages/ru.json')));
  const projects = read('../src/content/projects.json');
  assert.deepEqual(projects.map((p: {slug: string}) => p.slug), ['ekhonish', 'rzd-cargo', 'client-base', 'medtech']);
  for (const project of projects) {
    for (const locale of ['en', 'ru']) {
      for (const field of ['title', 'role', 'summary', 'contribution', 'result']) {
        assert.ok(project[locale][field]?.length > 0);
      }
    }
  }
});

test('structured data names countries, both name spellings and localized services', async () => {
  const {buildGraph} = await import('../src/lib/structured-data.ts');
  const services = [{name: 'Web development', description: 'Sites', path: '/services/web-development'}, {name: 'Design', description: 'UX'}];
  const graph = buildGraph({origin: 'https://example.com', locale: 'ru', services,
    faq: [{q: 'Q', a: 'A'}]})['@graph'] as Record<string, any>[];
  const type = (t: string) => graph.filter((node) => node['@type'] === t);
  const person = type('Person')[0];
  assert.equal(person.name, 'Станислав Синицын');
  assert.deepEqual(person.alternateName, ['Stanislav Sinitsyn']);
  const areas = type('ProfessionalService')[0].areaServed.map((a: {name: string}) => a.name);
  assert.ok(areas.includes('Russia') && areas.includes('United States') && areas.includes('Europe'));
  assert.ok(!areas.some((name: string) => /^[A-Z]{2}$/.test(name)), 'no bare ISO codes');
  assert.equal(type('Service').length, 2);
  assert.deepEqual(type('Service').map((service) => service.url),
    ['https://example.com/ru/services/web-development', 'https://example.com/ru#services']);
  assert.equal(type('FAQPage').length, 1);
});

test('robots and sitemap follow the indexing gate', async () => {
  const {default: robots} = await import('../src/app/robots.ts');
  const {default: sitemap} = await import('../src/app/sitemap.ts');
  const saved = {url: process.env.SITE_URL, on: process.env.ENABLE_INDEXING};
  try {
    process.env.SITE_URL = 'https://example.com';
    process.env.ENABLE_INDEXING = 'true';
    const open = robots() as {rules: {allow?: string}; sitemap?: string};
    assert.equal(open.rules.allow, '/');
    assert.equal(open.sitemap, 'https://example.com/sitemap.xml');
    const entries = sitemap();
    assert.equal(entries.length, 16);
    assert.ok(entries.some((entry) => entry.url === 'https://example.com/ru/services/web-development'));
    assert.ok(entries.some((entry) => entry.url === 'https://example.com/ru/services/mobile-apps'));
    assert.ok(entries.some((entry) => entry.url === 'https://example.com/ru/services/seo-geo'));
    assert.equal(entries[0].url, 'https://example.com', 'root has no trailing slash, like the canonical tag');
    assert.ok(entries.every((entry) => entry.lastModified && entry.alternates?.languages));
    process.env.ENABLE_INDEXING = 'false';
    assert.deepEqual((robots() as {rules: {disallow?: string}}).rules, {userAgent: '*', disallow: '/'});
  } finally {
    if (saved.url === undefined) delete process.env.SITE_URL; else process.env.SITE_URL = saved.url;
    if (saved.on === undefined) delete process.env.ENABLE_INDEXING; else process.env.ENABLE_INDEXING = saved.on;
  }
});

test('service page graph has WebPage, breadcrumb and Service with its own URL, and no FAQPage', async () => {
  const {buildGraph} = await import('../src/lib/structured-data.ts');
  const graph = buildGraph({origin: 'https://example.com', locale: 'en',
    servicePage: {path: '/services/web-development', name: 'Web development', description: 'Sites and apps'}})['@graph'] as Record<string, any>[];
  const type = (t: string) => graph.filter((node) => node['@type'] === t);
  const url = 'https://example.com/services/web-development';
  assert.equal(type('FAQPage').length, 0);
  assert.equal(type('Service').length, 1);
  assert.equal(type('Service')[0].url, url);
  assert.equal(type('WebPage')[0].mainEntity['@id'], url + '#service');
  const crumbs = type('WebPage')[0].breadcrumb.itemListElement;
  assert.deepEqual(crumbs.map((c: {item: string}) => c.item), ['https://example.com/', url]);
});

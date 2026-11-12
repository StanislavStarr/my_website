import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {localizedPath, unlocalizedPath} from '../src/lib/paths.ts';
import {getSiteOrigin, canIndex, pageMetadata} from '../src/lib/seo.ts';
import {createRound, stepRound, eggPosition, TRAVEL_MS, ROUND_MS} from '../src/components/game/engine.ts';

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

test('game catches an egg only in the selected lane', () => {
  const game = {...createRound('running'), nextSpawn: Infinity,
    eggs: [{id: 1, lane: 0 as const, age: TRAVEL_MS - 20}]};
  assert.equal(stepRound(game, 20).score, 1);
  const missed = stepRound({...game, lane: 1}, 20);
  assert.equal(missed.score, 0);
  assert.equal(missed.misses, 1);
  assert.equal(game.eggs.length, 1, 'input state is not mutated');
});

test('game ends on three misses or twenty seconds, then stops advancing', () => {
  const game = {...createRound('running'), nextSpawn: Infinity, misses: 2,
    eggs: [{id: 1, lane: 3 as const, age: TRAVEL_MS - 1}]};
  const ended = stepRound(game, 1);
  assert.equal(ended.phase, 'finished');
  assert.equal(ended.misses, 3);
  assert.equal(stepRound(ended, 100), ended);
  assert.equal(stepRound({...createRound('running'), nextSpawn: Infinity, elapsed: ROUND_MS - 5}, 10).elapsed, ROUND_MS);
});

test('each ramp arrives at the correct basket position', () => {
  assert.deepEqual(eggPosition({id: 0, lane: 0, age: TRAVEL_MS}), {x: 126, y: 82, rotation: 125});
  assert.deepEqual(eggPosition({id: 0, lane: 3, age: TRAVEL_MS}), {x: 234, y: 150, rotation: 235});
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

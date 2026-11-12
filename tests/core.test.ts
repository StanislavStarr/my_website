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

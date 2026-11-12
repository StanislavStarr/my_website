// Pure snake rules: no DOM, no timers, so they can be unit-tested.
export const COLS = 15;
export const ROWS = 16;

export type Dir = 'up' | 'down' | 'left' | 'right';
export type Point = {x: number; y: number};
export type Phase = 'ready' | 'running' | 'finished';
export type Game = {
  phase: Phase;
  snake: Point[];   // head first
  dir: Dir;         // direction of the last completed move
  next: Dir;        // direction requested for the next move
  food: Point;
  score: number;
};

const vectors: Record<Dir, Point> = {up: {x: 0, y: -1}, down: {x: 0, y: 1}, left: {x: -1, y: 0}, right: {x: 1, y: 0}};
const opposite: Record<Dir, Dir> = {up: 'down', down: 'up', left: 'right', right: 'left'};

export const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

export function placeFood(snake: Point[], rng: () => number = Math.random): Point {
  const free: Point[] = [];
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    if (!snake.some((s) => s.x === x && s.y === y)) free.push({x, y});
  }
  return free[Math.floor(rng() * free.length)] ?? {x: 0, y: 0};
}

export function createGame(phase: Phase = 'ready', rng: () => number = Math.random): Game {
  const y = Math.floor(ROWS / 2), x = Math.floor(COLS / 2);
  const snake = [{x, y}, {x: x - 1, y}, {x: x - 2, y}];
  return {phase, snake, dir: 'right', next: 'right', food: placeFood(snake, rng), score: 0};
}

/** Queue a turn. A 180° reversal would bite the neck, so it is ignored. */
export function turn(game: Game, dir: Dir): Game {
  if (opposite[game.dir] === dir || game.next === dir) return game;
  return {...game, next: dir};
}

/** Advance one cell. Walls wrap around; touching the own body ends the game. */
export function step(game: Game, rng: () => number = Math.random): Game {
  if (game.phase !== 'running') return game;
  const v = vectors[game.next];
  const head = {x: (game.snake[0].x + v.x + COLS) % COLS, y: (game.snake[0].y + v.y + ROWS) % ROWS};
  const eats = same(head, game.food);
  // The tail cell is vacated on this move unless the snake grows.
  const body = eats ? game.snake : game.snake.slice(0, -1);
  if (body.some((s) => same(s, head))) return {...game, dir: game.next, phase: 'finished'};

  const snake = [head, ...body];
  if (!eats) return {...game, snake, dir: game.next};
  const full = snake.length === COLS * ROWS;
  return {...game, snake, dir: game.next, score: game.score + 1,
    food: full ? game.food : placeFood(snake, rng), phase: full ? 'finished' : 'running'};
}

/** Milliseconds per move: starts relaxed, speeds up with the score. */
export const tickMs = (score: number) => Math.max(70, 150 - score * 4);

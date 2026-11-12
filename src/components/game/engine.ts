export const ROUND_MS = 20_000;
export const TRAVEL_MS = 2_100;
export const SPAWN_MS = 1_050;
export const MAX_MISSES = 3;

export type Lane = 0 | 1 | 2 | 3;
export type Egg = {id: number; lane: Lane; age: number};
export type Round = {
  phase: 'idle' | 'running' | 'finished';
  elapsed: number; score: number; misses: number; lane: Lane;
  nextSpawn: number; nextId: number; eggs: Egg[];
};

export function createRound(phase: Round['phase'] = 'idle'): Round {
  return {phase, elapsed: 0, score: 0, misses: 0, lane: 0,
    nextSpawn: 400, nextId: 0, eggs: []};
}

export function stepRound(round: Round, delta: number, random = Math.random): Round {
  if (round.phase !== 'running') return round;
  let {nextSpawn, nextId, score, misses} = round;
  const dt = Math.max(0, Math.min(delta, ROUND_MS - round.elapsed));
  const elapsed = round.elapsed + dt;
  const eggs = round.eggs.map((egg) => ({...egg, age: egg.age + dt}));
  const remaining: Egg[] = [];

  while (nextSpawn <= elapsed && nextSpawn < ROUND_MS) {
    eggs.push({id: nextId++, lane: Math.min(3, Math.floor(random() * 4)) as Lane,
      age: elapsed - nextSpawn});
    nextSpawn += SPAWN_MS;
  }


  for (const egg of eggs) {
    if (misses >= MAX_MISSES) break;
    if (egg.age < TRAVEL_MS) remaining.push(egg);
    else if (egg.lane === round.lane) score++;
    else misses++;
  }

  return {...round, elapsed, nextSpawn, nextId, score, misses, eggs: remaining,
    phase: elapsed >= ROUND_MS || misses >= MAX_MISSES ? 'finished' : 'running'};
}

export function eggPosition(egg: Egg) {
  const p = egg.age / TRAVEL_MS;
  const right = egg.lane % 2 === 1;
  const top = egg.lane < 2;
  const startX = right ? 320 : 40;
  const endX = right ? 234 : 126;
  const startY = top ? 30 : 100;
  const endY = top ? 82 : 150;

  return {x: startX + (endX - startX) * p, y: startY + (endY - startY) * p,
    rotation: (right ? 1 : -1) * 55 + p * 180};
}

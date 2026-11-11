import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const museum = readFileSync('public/world-cup.html', 'utf8');
const expression = museum.match(/const teams=(TEAMS\.filter[^;]+);/)?.[1];

describe('Visited team flags', () => {
  it('includes teams visited through locker rooms and other team rooms only once', () => {
    expect(expression).toBeDefined();
    const teams = runInNewContext(expression ?? '[]', {
      TEAMS: ['Netherlands', 'Argentina', 'Spain', 'Brazil'],
      S: { rooms: new Set(['Central Hall', 'Netherlands locker room', 'Argentina, the Final', 'Spain, World Cup highlight', 'Spain locker room']) },
    });
    expect(Array.from(teams)).toEqual(['Netherlands', 'Argentina', 'Spain']);
  });
});
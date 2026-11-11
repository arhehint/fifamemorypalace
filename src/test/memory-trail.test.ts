import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const museum = readFileSync('public/world-cup.html', 'utf8');
const expression = museum.match(/const teams=(TEAMS\.filter[^;]+);/)?.[1];
const trailFunction = museum.match(/function trailEntries\(\)\{[\s\S]*?\n\}/)?.[0];

function entries() {
  return runInNewContext(`${trailFunction}; trailEntries()`, {
    S: { objs: new Set(['Jersey 10 Lionel Messi, Argentina', 'Best player, Argentina', 'Achievement, Argentina', 'Bracket, Argentina', 'Formation scrub, match 1']), moments: ['Argentina, biggest achievement'] },
    BEST: { Argentina: ['Lionel Messi', 'Best player', 'Performance details'] },
  });
}

describe('Memory trail categories', () => {
  it('includes only jerseys in Player', () => {
    expect(Array.from(entries().players)).toEqual(['Jersey 10 Lionel Messi, Argentina']);
  });
  it('includes only visited best players, without achievements or performance details', () => {
    expect(Array.from(entries().bestPlayers)).toEqual(['Argentina, Lionel Messi']);
  });
  it('starts facing the Argentina door', () => {
    const teamsExpression = museum.match(/const TEAMS=(\[[^;]+\]);/)?.[1];
    const yawExpression = museum.match(/const HALL_START_YAW=([^;]+);/)?.[1];
    const teams = runInNewContext(teamsExpression ?? '[]');
    const yaw = runInNewContext(yawExpression ?? 'NaN', { TEAMS: teams });
    const angle = teams.indexOf('Argentina') / teams.length * Math.PI * 2;
    expect(-Math.sin(yaw)).toBeCloseTo(Math.sin(angle));
    expect(-Math.cos(yaw)).toBeCloseTo(Math.cos(angle));
  });
});

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
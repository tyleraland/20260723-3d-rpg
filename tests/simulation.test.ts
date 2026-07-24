import { describe, expect, it } from 'vitest';
import { GAME_CONFIG } from '../src/config/gameConfig';
import { Simulation } from '../src/simulation/Simulation';

describe('Simulation', () => {
  it('spawns the requested number of characters on the XZ plane', () => {
    const simulation = new Simulation(20, 42);
    expect(simulation.store.size).toBe(20);
    for (const entity of simulation.store.entities) {
      expect(entity.position.y).toBe(0);
      expect(Math.abs(entity.position.x)).toBeLessThanOrEqual(GAME_CONFIG.worldHalfSize);
      expect(Math.abs(entity.position.z)).toBeLessThanOrEqual(GAME_CONFIG.worldHalfSize);
    }
  });

  it('keeps roaming characters inside world bounds', () => {
    const simulation = new Simulation(80, 7);
    for (let frame = 0; frame < 60 * 45; frame += 1) simulation.update(1 / 60);
    for (const entity of simulation.store.entities) {
      expect(Math.abs(entity.position.x)).toBeLessThanOrEqual(GAME_CONFIG.worldHalfSize);
      expect(entity.position.y).toBe(0);
      expect(Math.abs(entity.position.z)).toBeLessThanOrEqual(GAME_CONFIG.worldHalfSize);
    }
  });

  it('lets attacks override locomotion and then resumes movement', () => {
    const simulation = new Simulation(1, 99);
    const entity = simulation.store.entities[0];
    simulation.setRandomDestination(entity.id);
    expect(entity.mode).toBe('walking');
    expect(simulation.requestAttack(entity.id)).toBe(true);
    expect(entity.mode).toBe('attacking');
    simulation.update(GAME_CONFIG.attackDuration + 0.1);
    for (let index = 0; index < 20; index += 1) simulation.update(0.05);
    expect(entity.mode).not.toBe('attacking');
  });
});

import type { Entity } from '../Entity';

export type AnimationSample = {
  phase: number;
  stride: number;
  bob: number;
  attack: number;
};

export function animationSystem(entity: Entity, elapsed: number): AnimationSample {
  if (entity.mode === 'attacking') {
    const progress = 1 - Math.max(0, entity.attackRemaining) / 0.78;
    return {
      phase: elapsed,
      stride: 0,
      bob: Math.sin(progress * Math.PI) * 0.035,
      attack: Math.sin(progress * Math.PI)
    };
  }

  if (entity.mode === 'walking') {
    const phase = elapsed * 8.5 + entity.id * 0.7;
    return {
      phase,
      stride: Math.sin(phase) * 0.65,
      bob: Math.abs(Math.sin(phase)) * 0.05,
      attack: 0
    };
  }

  const phase = elapsed * 1.8 + entity.id;
  return { phase, stride: 0, bob: Math.sin(phase) * 0.025, attack: 0 };
}

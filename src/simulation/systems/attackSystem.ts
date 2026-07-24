import { MathUtils } from 'three';
import { GAME_CONFIG } from '../../config/gameConfig';
import type { Entity } from '../Entity';
import type { RandomSource } from './movementSystem';

export function beginAttack(entity: Entity) {
  if (entity.mode === 'attacking') return false;
  entity.resumeMode = entity.mode;
  entity.mode = 'attacking';
  entity.attackRemaining = GAME_CONFIG.attackDuration;
  entity.animationRevision += 1;
  return true;
}

export function attackSystem(entity: Entity, delta: number, random: RandomSource) {
  if (entity.mode === 'attacking') {
    entity.attackRemaining -= delta;
    if (entity.attackRemaining <= 0) {
      const remainingDistance = entity.position.distanceTo(entity.destination);
      entity.mode = remainingDistance > GAME_CONFIG.arrivalDistance ? entity.resumeMode : 'idle';
      entity.attackCooldown = MathUtils.lerp(
        GAME_CONFIG.minAttackCooldown,
        GAME_CONFIG.maxAttackCooldown,
        random()
      );
      entity.animationRevision += 1;
    }
    return;
  }

  entity.attackCooldown -= delta;
  if (entity.attackCooldown <= 0) beginAttack(entity);
}

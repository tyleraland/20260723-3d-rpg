import { MathUtils } from 'three';
import { GAME_CONFIG } from '../../config/gameConfig';
import type { Entity } from '../Entity';

export type RandomSource = () => number;

function shortestAngle(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

export function chooseDestination(entity: Entity, random: RandomSource) {
  const margin = 0.5;
  const extent = GAME_CONFIG.worldHalfSize - margin;
  entity.destination.set((random() * 2 - 1) * extent, 0, (random() * 2 - 1) * extent);
  entity.mode = 'walking';
  entity.animationRevision += 1;
}

export function movementSystem(entity: Entity, delta: number, random: RandomSource) {
  if (entity.mode === 'attacking') return;

  if (entity.mode === 'idle') {
    entity.idleTimer -= delta;
    if (entity.idleTimer <= 0) chooseDestination(entity, random);
    return;
  }

  const dx = entity.destination.x - entity.position.x;
  const dz = entity.destination.z - entity.position.z;
  const distance = Math.hypot(dx, dz);

  if (distance <= GAME_CONFIG.arrivalDistance) {
    entity.position.copy(entity.destination);
    entity.position.y = 0;
    entity.mode = 'idle';
    entity.idleTimer = MathUtils.lerp(
      GAME_CONFIG.minIdleSeconds,
      GAME_CONFIG.maxIdleSeconds,
      random()
    );
    entity.animationRevision += 1;
    return;
  }

  const step = Math.min(distance, entity.speed * delta);
  const targetYaw = Math.atan2(dx, dz);
  entity.yaw += shortestAngle(entity.yaw, targetYaw) * Math.min(1, delta * 9);
  entity.position.x += (dx / distance) * step;
  entity.position.z += (dz / distance) * step;
  entity.position.x = MathUtils.clamp(
    entity.position.x,
    -GAME_CONFIG.worldHalfSize,
    GAME_CONFIG.worldHalfSize
  );
  entity.position.y = 0;
  entity.position.z = MathUtils.clamp(
    entity.position.z,
    -GAME_CONFIG.worldHalfSize,
    GAME_CONFIG.worldHalfSize
  );
}

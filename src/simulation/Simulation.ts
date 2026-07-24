import { MathUtils, Vector3 } from 'three';
import { GAME_CONFIG } from '../config/gameConfig';
import type { Entity, EntitySnapshot } from './Entity';
import { EntityStore } from './EntityStore';
import { attackSystem, beginAttack } from './systems/attackSystem';
import { movementSystem } from './systems/movementSystem';

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export class Simulation {
  readonly store = new EntityStore();
  private readonly listeners = new Set<() => void>();
  private readonly random: () => number;
  private entitySnapshot: Entity[] = [];
  private nextId = 1;

  constructor(count: number = GAME_CONFIG.initialEntityCount, seed = 0xa51fa11) {
    this.random = mulberry32(seed);
    this.resize(count);
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getEntities = () => this.entitySnapshot;

  resize(count: number) {
    const safeCount = Math.max(0, Math.floor(count));
    while (this.store.size < safeCount) this.store.add(this.createEntity());
    while (this.store.size > safeCount) {
      const last = this.store.entities.at(-1);
      if (last) this.store.delete(last.id);
    }
    this.entitySnapshot = this.store.entities;
    this.listeners.forEach((listener) => listener());
  }

  update(deltaSeconds: number) {
    const delta = Math.min(Math.max(deltaSeconds, 0), GAME_CONFIG.maxDeltaSeconds);
    for (const entity of this.store.entities) {
      attackSystem(entity, delta, this.random);
      movementSystem(entity, delta, this.random);
    }
  }

  requestAttack(id: number) {
    const entity = this.store.get(id);
    return entity ? beginAttack(entity) : false;
  }

  setRandomDestination(id: number) {
    const entity = this.store.get(id);
    if (!entity) return false;
    const extent = GAME_CONFIG.worldHalfSize - 0.5;
    entity.destination.set((this.random() * 2 - 1) * extent, 0, (this.random() * 2 - 1) * extent);
    if (entity.mode !== 'attacking') entity.mode = 'walking';
    entity.animationRevision += 1;
    return true;
  }

  getSnapshot(id: number): EntitySnapshot | null {
    const entity = this.store.get(id);
    if (!entity) return null;
    return {
      id: entity.id,
      mode: entity.mode,
      speed: entity.speed,
      position: { x: entity.position.x, y: entity.position.y, z: entity.position.z }
    };
  }

  private createEntity(): Entity {
    const extent = GAME_CONFIG.worldHalfSize - 0.8;
    const position = new Vector3(
      (this.random() * 2 - 1) * extent,
      0,
      (this.random() * 2 - 1) * extent
    );
    const destination = position.clone();
    const entity: Entity = {
      id: this.nextId++,
      assetId: 'warrior',
      position,
      destination,
      yaw: this.random() * Math.PI * 2,
      speed: MathUtils.lerp(GAME_CONFIG.minSpeed, GAME_CONFIG.maxSpeed, this.random()),
      mode: 'idle',
      resumeMode: 'idle',
      idleTimer: this.random() * 1.5,
      attackCooldown: MathUtils.lerp(
        GAME_CONFIG.minAttackCooldown,
        GAME_CONFIG.maxAttackCooldown,
        this.random()
      ),
      attackRemaining: 0,
      animationRevision: 0
    };
    return entity;
  }
}

export const simulation = new Simulation();

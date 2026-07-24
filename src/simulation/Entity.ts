import { Vector3 } from 'three';

export type EntityMode = 'idle' | 'walking' | 'attacking';

export type EntityTransform = {
  position: { x: number; y: number; z: number };
  yaw: number;
};

export type Entity = {
  id: number;
  assetId: 'warrior';
  position: Vector3;
  destination: Vector3;
  yaw: number;
  speed: number;
  mode: EntityMode;
  resumeMode: Exclude<EntityMode, 'attacking'>;
  idleTimer: number;
  attackCooldown: number;
  attackRemaining: number;
  animationRevision: number;
};

export type EntitySnapshot = {
  id: number;
  mode: EntityMode;
  speed: number;
  position: { x: number; y: number; z: number };
};

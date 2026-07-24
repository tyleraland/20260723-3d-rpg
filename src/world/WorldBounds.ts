import { GAME_CONFIG } from '../config/gameConfig';

export const WORLD_BOUNDS = {
  minX: -GAME_CONFIG.worldHalfSize,
  maxX: GAME_CONFIG.worldHalfSize,
  minZ: -GAME_CONFIG.worldHalfSize,
  maxZ: GAME_CONFIG.worldHalfSize
} as const;

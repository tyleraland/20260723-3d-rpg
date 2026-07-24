export const ANIMATION_NAMES = {
  idle: 'idle',
  walk: 'walk',
  attack: 'attack'
} as const;

export type NormalizedAnimationName = keyof typeof ANIMATION_NAMES;

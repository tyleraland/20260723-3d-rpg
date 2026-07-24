import { LoopOnce, LoopRepeat, type AnimationAction } from 'three';
import type { EntityMode } from '../simulation/Entity';

export function actionForMode(
  actions: Record<string, AnimationAction | null> | undefined,
  mode: EntityMode
) {
  const name = mode === 'walking' ? 'walk' : mode === 'attacking' ? 'attack' : 'idle';
  return actions?.[name] ?? null;
}

export function transitionAnimation(
  previous: AnimationAction | null,
  next: AnimationAction | null,
  mode: EntityMode
) {
  if (!next || next === previous) return next;
  previous?.fadeOut(0.14);
  next.reset().setEffectiveTimeScale(1).setEffectiveWeight(1);
  if (mode === 'attacking') next.setLoop(LoopOnce, 1).clampWhenFinished = true;
  else next.setLoop(LoopRepeat, Infinity).clampWhenFinished = false;
  next.fadeIn(0.14).play();
  return next;
}

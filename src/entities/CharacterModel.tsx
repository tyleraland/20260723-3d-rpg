import { useAnimations, useGLTF } from '@react-three/drei';
import { type ThreeEvent, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { Group, type AnimationAction } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { CharacterAssetDefinition } from '../assets/AssetManifest';
import { resolveAssetUrl } from '../assets/AssetManifest';
import type { Entity } from '../simulation/Entity';
import { useUiStore } from '../state/uiStore';
import { actionForMode, transitionAnimation } from './CharacterAnimations';
import { SelectionMarker } from './SelectionMarker';

type CharacterModelProps = {
  entity: Entity;
  asset: CharacterAssetDefinition;
};

export function CharacterModel({ entity, asset }: CharacterModelProps) {
  const rootRef = useRef<Group>(null);
  const modelUrl = resolveAssetUrl(asset.url);
  const { scene, animations } = useGLTF(modelUrl);
  const clonedScene = useMemo(() => clone(scene), [scene]);
  const { actions } = useAnimations(animations, clonedScene);
  const currentAction = useRef<AnimationAction | null>(null);
  const revision = useRef(-1);
  const selected = useUiStore((state) => state.selectedEntityId === entity.id);
  const selectEntity = useUiStore((state) => state.selectEntity);

  useEffect(() => {
    const idle = actions[asset.animations.idle];
    idle?.reset().fadeIn(0.1).play();
    currentAction.current = idle ?? null;
    return () => {
      Object.values(actions).forEach((action) => action?.stop());
    };
  }, [actions, asset.animations.idle]);

  useFrame(() => {
    const root = rootRef.current;
    if (!root) return;
    root.position.copy(entity.position);
    root.rotation.y = entity.yaw + asset.rotationY;
    if (revision.current !== entity.animationRevision) {
      revision.current = entity.animationRevision;
      const next = actionForMode(actions, entity.mode);
      currentAction.current = transitionAnimation(currentAction.current, next, entity.mode);
    }
  });

  const handleSelect = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    selectEntity(entity.id);
  };

  return (
    <group ref={rootRef} onPointerDown={handleSelect}>
      {selected && <SelectionMarker />}
      <primitive object={clonedScene} scale={asset.scale} dispose={null} />
    </group>
  );
}

import { type ThreeEvent, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';
import type { CharacterAssetDefinition } from '../assets/AssetManifest';
import type { Entity } from '../simulation/Entity';
import { animationSystem } from '../simulation/systems/animationSystem';
import { useUiStore } from '../state/uiStore';
import { CharacterModel } from './CharacterModel';
import { SelectionMarker } from './SelectionMarker';

export function Character({
  entity,
  asset
}: {
  entity: Entity;
  asset: CharacterAssetDefinition | null;
}) {
  return asset ? (
    <CharacterModel entity={entity} asset={asset} />
  ) : (
    <ProceduralCharacter entity={entity} />
  );
}

function ProceduralCharacter({ entity }: { entity: Entity }) {
  const rootRef = useRef<Group>(null);
  const bodyRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const selected = useUiStore((state) => state.selectedEntityId === entity.id);
  const selectEntity = useUiStore((state) => state.selectEntity);

  useFrame((state) => {
    const root = rootRef.current;
    const body = bodyRef.current;
    const leftArm = leftArmRef.current;
    const rightArm = rightArmRef.current;
    const leftLeg = leftLegRef.current;
    const rightLeg = rightLegRef.current;
    if (!root || !body || !leftArm || !rightArm || !leftLeg || !rightLeg) return;

    const sample = animationSystem(entity, state.clock.elapsedTime);
    root.position.copy(entity.position);
    root.rotation.y = entity.yaw;
    body.position.y = sample.bob;
    leftArm.rotation.x = sample.stride;
    leftLeg.rotation.x = -sample.stride;
    rightLeg.rotation.x = sample.stride;
    rightArm.rotation.x = -sample.stride - sample.attack * 1.8;
    rightArm.rotation.z = -sample.attack * 0.9;
  });

  const handleSelect = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    selectEntity(entity.id);
  };

  const tunic = entity.id % 3 === 0 ? '#864636' : entity.id % 3 === 1 ? '#405947' : '#4e5062';

  return (
    <group ref={rootRef} onPointerDown={handleSelect}>
      {selected && <SelectionMarker />}
      <group ref={bodyRef} scale={0.82}>
        <mesh position={[0, 1.72, 0]}>
          <sphereGeometry args={[0.23, 12, 9]} />
          <meshStandardMaterial color="#d6a174" roughness={0.92} />
        </mesh>
        <mesh position={[0, 1.82, -0.02]} scale={[1.06, 0.58, 1.06]}>
          <sphereGeometry args={[0.245, 12, 8]} />
          <meshStandardMaterial color="#292d28" roughness={0.95} />
        </mesh>
        <mesh position={[0, 1.14, 0]} scale={[0.76, 1, 0.45]}>
          <boxGeometry args={[0.72, 0.86, 0.55]} />
          <meshStandardMaterial color={tunic} roughness={0.82} />
        </mesh>
        <mesh position={[0, 1.22, 0.29]} scale={[0.52, 0.72, 0.12]}>
          <boxGeometry args={[0.72, 0.86, 0.3]} />
          <meshStandardMaterial color="#b36b38" roughness={0.76} />
        </mesh>
        <group ref={leftArmRef} position={[-0.42, 1.4, 0]}>
          <mesh position={[0, -0.32, 0]}>
            <capsuleGeometry args={[0.105, 0.46, 4, 8]} />
            <meshStandardMaterial color={tunic} roughness={0.9} />
          </mesh>
        </group>
        <group ref={rightArmRef} position={[0.42, 1.4, 0]}>
          <mesh position={[0, -0.32, 0]}>
            <capsuleGeometry args={[0.105, 0.46, 4, 8]} />
            <meshStandardMaterial color={tunic} roughness={0.9} />
          </mesh>
          <group position={[0, -0.72, 0.02]} rotation-z={-0.12}>
            <mesh position={[0, -0.28, 0]}>
              <boxGeometry args={[0.075, 0.63, 0.035]} />
              <meshStandardMaterial color="#bcc2bc" metalness={0.58} roughness={0.32} />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.32, 0.065, 0.08]} />
              <meshStandardMaterial color="#d39a4b" metalness={0.25} roughness={0.48} />
            </mesh>
          </group>
        </group>
        <group ref={leftLegRef} position={[-0.18, 0.77, 0]}>
          <mesh position={[0, -0.38, 0]}>
            <capsuleGeometry args={[0.12, 0.54, 4, 8]} />
            <meshStandardMaterial color="#343832" roughness={0.94} />
          </mesh>
        </group>
        <group ref={rightLegRef} position={[0.18, 0.77, 0]}>
          <mesh position={[0, -0.38, 0]}>
            <capsuleGeometry args={[0.12, 0.54, 4, 8]} />
            <meshStandardMaterial color="#343832" roughness={0.94} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

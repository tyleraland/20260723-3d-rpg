import type { ThreeEvent } from '@react-three/fiber';
import { useUiStore } from '../state/uiStore';
import { SelectionMarker } from '../entities/SelectionMarker';

type WorldObjectProps = {
  id: string;
  label: string;
  position: [number, number, number];
  color: string;
  scale?: number;
};

function Waystone({ id, label, position, color, scale = 1 }: WorldObjectProps) {
  const selected = useUiStore((state) => state.selectedObject?.id === id);
  const selectObject = useUiStore((state) => state.selectObject);
  const handleSelect = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    selectObject({ id, label });
  };
  return (
    <group position={position} scale={scale} onPointerDown={handleSelect}>
      {selected && <SelectionMarker color="#91c5a0" />}
      <mesh position-y={0.4} rotation-y={0.2}>
        <dodecahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#4b5148" roughness={0.92} />
      </mesh>
      <mesh position-y={0.92} scale={[0.62, 1.45, 0.52]} rotation={[0.03, 0.25, -0.06]}>
        <octahedronGeometry args={[0.52, 0]} />
        <meshStandardMaterial color={color} roughness={0.68} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.93, 0.41]} scale={[0.24, 0.65, 0.04]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d8b16b" emissive="#392515" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

export function WorldObjects() {
  return (
    <group>
      <Waystone
        id="west-waystone"
        label="Western waystone"
        position={[-7.4, 0, -7.2]}
        color="#596d62"
      />
      <Waystone
        id="north-beacon"
        label="North watch beacon"
        position={[7.1, 0, -7.4]}
        color="#73514a"
        scale={0.86}
      />
      <Waystone
        id="old-marker"
        label="Old road marker"
        position={[7.3, 0, 6.8]}
        color="#59645a"
        scale={0.76}
      />
    </group>
  );
}

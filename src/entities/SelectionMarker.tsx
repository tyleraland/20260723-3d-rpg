export function SelectionMarker({ color = '#e8b36b' }: { color?: string }) {
  return (
    <group position={[0, 0.035, 0]}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.48, 0.62, 32]} />
        <meshBasicMaterial color={color} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.055, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.12, 0.16, 4]} />
        <meshBasicMaterial color={color} depthWrite={false} />
      </mesh>
    </group>
  );
}

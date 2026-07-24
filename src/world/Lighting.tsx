export function Lighting() {
  return (
    <>
      <hemisphereLight args={['#d9d5b5', '#333d2d', 1.8]} />
      <directionalLight position={[-8, 15, 9]} color="#ffe7ba" intensity={2.6} />
    </>
  );
}

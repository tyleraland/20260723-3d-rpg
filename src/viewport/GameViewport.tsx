import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { useUiStore } from '../state/uiStore';
import { Scene } from './Scene';

export function GameViewport() {
  const clearSelection = useUiStore((state) => state.clearSelection);
  return (
    <main className="viewport" aria-label="Ashfall patrol simulation">
      <Canvas
        dpr={[1, 1.5]}
        frameloop="always"
        shadows={false}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
        onPointerMissed={() => clearSelection()}
        fallback={<div className="webgl-error">WebGL is required to render the patrol.</div>}
      >
        <Scene />
      </Canvas>
    </main>
  );
}

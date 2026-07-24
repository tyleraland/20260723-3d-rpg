import { useFrame } from '@react-three/fiber';
import { Suspense, useRef, useSyncExternalStore } from 'react';
import type { CharacterAssetDefinition } from '../assets/AssetManifest';
import { Character } from '../entities/Character';
import { simulation } from '../simulation/Simulation';
import { updateSimulation } from '../simulation/SimulationLoop';
import { useUiStore } from '../state/uiStore';
import { GroundPlane } from '../world/GroundPlane';
import { Lighting } from '../world/Lighting';
import { WorldObjects } from '../world/WorldObjects';
import { CameraRig } from './CameraRig';
import { performanceStore } from './performanceStore';
import { SelectionController } from './SelectionController';

function SimulationDriver() {
  useFrame((state, delta) => updateSimulation(simulation, state, delta), -10);
  return null;
}

function PerformanceCollector() {
  const metrics = useRef({ elapsed: 0, smoothedFrameTime: 16.7 });
  useFrame((state, delta) => {
    metrics.current.elapsed += delta;
    metrics.current.smoothedFrameTime += (delta * 1000 - metrics.current.smoothedFrameTime) * 0.08;
    if (metrics.current.elapsed < 0.25) return;
    metrics.current.elapsed = 0;
    performanceStore.update({
      fps: Math.round(1000 / Math.max(1, metrics.current.smoothedFrameTime)),
      frameTime: metrics.current.smoothedFrameTime,
      visibleEntities: simulation.store.size,
      drawCalls: state.gl.info.render.calls,
      triangles: state.gl.info.render.triangles,
      textures: state.gl.info.memory.textures
    });
  });
  return null;
}

function ProceduralSquad({ entities }: { entities: ReturnType<typeof simulation.getEntities> }) {
  return entities.map((entity) => <Character key={entity.id} entity={entity} asset={null} />);
}

function CharacterSquad() {
  const entities = useSyncExternalStore(
    simulation.subscribe,
    simulation.getEntities,
    simulation.getEntities
  );
  const manifest = useUiStore((state) => state.assetManifest);
  const warrior = (manifest?.assets.find(
    (asset) => asset.id === 'warrior' && asset.kind === 'character'
  ) ?? null) as CharacterAssetDefinition | null;

  if (!warrior) return <ProceduralSquad entities={entities} />;
  return (
    <Suspense fallback={<ProceduralSquad entities={entities} />}>
      {entities.map((entity) => (
        <Character key={entity.id} entity={entity} asset={warrior} />
      ))}
    </Suspense>
  );
}

export function Scene() {
  return (
    <>
      <color attach="background" args={['#263029']} />
      <fog attach="fog" args={['#263029', 25, 49]} />
      <CameraRig />
      <Lighting />
      <GroundPlane />
      <WorldObjects />
      <CharacterSquad />
      <SelectionController />
      <SimulationDriver />
      <PerformanceCollector />
    </>
  );
}

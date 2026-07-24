import { useMemo } from 'react';
import { Color, Matrix4, Quaternion, Vector3 } from 'three';
import { GAME_CONFIG } from '../config/gameConfig';

const scatterCount = 72;

function GroundScatter() {
  const matrices = useMemo(() => {
    const result: Matrix4[] = [];
    let seed = 12987;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let index = 0; index < scatterCount; index += 1) {
      const x = (random() * 2 - 1) * (GAME_CONFIG.worldHalfSize - 0.25);
      const z = (random() * 2 - 1) * (GAME_CONFIG.worldHalfSize - 0.25);
      const scale = 0.35 + random() * 0.75;
      result.push(
        new Matrix4().compose(
          new Vector3(x, 0.035, z),
          new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), random() * Math.PI),
          new Vector3(scale, scale, scale)
        )
      );
    }
    return result;
  }, []);

  return (
    <instancedMesh
      args={[undefined, undefined, scatterCount]}
      frustumCulled
      onUpdate={(mesh) => {
        matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
        mesh.instanceMatrix.needsUpdate = true;
      }}
    >
      <dodecahedronGeometry args={[0.065, 0]} />
      <meshStandardMaterial color="#667054" roughness={1} />
    </instancedMesh>
  );
}

export function GroundPlane() {
  const size = GAME_CONFIG.worldHalfSize * 2 + 0.8;
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.03}>
        <planeGeometry args={[size, size, 1, 1]} />
        <meshStandardMaterial color={new Color('#5b654d')} roughness={1} />
      </mesh>
      <gridHelper args={[size, 18, '#818b68', '#6a745a']} position={[0, -0.015, 0]} />
      <GroundScatter />
      <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
        <ringGeometry args={[size * 0.69, size * 0.715, 4]} />
        <meshBasicMaterial color="#b88b54" />
      </mesh>
    </group>
  );
}

import { OrthographicCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { OrthographicCamera as ThreeOrthographicCamera } from 'three';

export function CameraRig() {
  const cameraRef = useRef<ThreeOrthographicCamera>(null);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    camera.zoom = Math.max(13, size.height / 27.5);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [size.height, size.width]);

  return (
    <OrthographicCamera
      ref={cameraRef}
      makeDefault
      position={[15.5, 19, 15.5]}
      near={0.1}
      far={80}
    />
  );
}

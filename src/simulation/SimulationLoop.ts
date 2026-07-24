import type { RootState } from '@react-three/fiber';
import type { Simulation } from './Simulation';

export function updateSimulation(simulation: Simulation, _state: RootState, delta: number) {
  simulation.update(delta);
}

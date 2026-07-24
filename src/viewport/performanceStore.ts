export type PerformanceMetrics = {
  fps: number;
  frameTime: number;
  visibleEntities: number;
  drawCalls: number;
  triangles: number;
  textures: number;
};

const listeners = new Set<() => void>();
let snapshot: PerformanceMetrics = {
  fps: 0,
  frameTime: 0,
  visibleEntities: 0,
  drawCalls: 0,
  triangles: 0,
  textures: 0
};

export const performanceStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return snapshot;
  },
  update(metrics: PerformanceMetrics) {
    snapshot = metrics;
    listeners.forEach((listener) => listener());
  }
};

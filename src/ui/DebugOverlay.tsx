import { useSyncExternalStore } from 'react';
import { GAME_CONFIG } from '../config/gameConfig';
import { performanceStore } from '../viewport/performanceStore';
import { simulation } from '../simulation/Simulation';

export function DebugOverlay() {
  const metrics = useSyncExternalStore(
    performanceStore.subscribe,
    performanceStore.getSnapshot,
    performanceStore.getSnapshot
  );

  return (
    <aside className="debug-overlay" aria-label="Renderer statistics">
      <div className="debug-heading">
        <span>Field telemetry</span>
        <strong>{metrics.fps} FPS</strong>
      </div>
      <dl>
        <div>
          <dt>Frame</dt>
          <dd>{metrics.frameTime.toFixed(1)} ms</dd>
        </div>
        <div>
          <dt>Visible</dt>
          <dd>{metrics.visibleEntities}</dd>
        </div>
        <div>
          <dt>Draw calls</dt>
          <dd>{metrics.drawCalls}</dd>
        </div>
        <div>
          <dt>Triangles</dt>
          <dd>{metrics.triangles.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Textures</dt>
          <dd>{metrics.textures}</dd>
        </div>
      </dl>
      <div className="debug-counts">
        <button type="button" onClick={() => simulation.resize(GAME_CONFIG.initialEntityCount)}>
          20 normal
        </button>
        <button type="button" onClick={() => simulation.resize(GAME_CONFIG.stressEntityCount)}>
          80 stress
        </button>
      </div>
    </aside>
  );
}

import { useEffect, useState } from 'react';
import type { EntitySnapshot } from '../simulation/Entity';
import { simulation } from '../simulation/Simulation';
import { useUiStore } from '../state/uiStore';

function formatMode(mode: EntitySnapshot['mode']) {
  return mode === 'attacking'
    ? 'Sword attack'
    : mode === 'walking'
      ? 'On patrol'
      : 'Standing watch';
}

export function SelectedEntityPanel() {
  const selectedEntityId = useUiStore((state) => state.selectedEntityId);
  const selectedObject = useUiStore((state) => state.selectedObject);
  const [snapshot, setSnapshot] = useState<EntitySnapshot | null>(null);

  useEffect(() => {
    if (selectedEntityId === null) return;
    const update = () => setSnapshot(simulation.getSnapshot(selectedEntityId));
    const frame = window.requestAnimationFrame(update);
    const interval = window.setInterval(update, 180);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, [selectedEntityId]);

  if (selectedObject) {
    return (
      <div className="selection-summary" aria-live="polite">
        <span className="selection-kicker">World object</span>
        <strong>{selectedObject.label}</strong>
      </div>
    );
  }

  if (!snapshot || snapshot.id !== selectedEntityId) {
    return (
      <div className="selection-summary selection-summary--empty">
        <span className="selection-kicker">No selection</span>
        <strong>Tap a patrol member</strong>
      </div>
    );
  }

  return (
    <div className="selection-summary" aria-live="polite">
      <span className="selection-kicker">Patrol #{String(snapshot.id).padStart(2, '0')}</span>
      <strong>
        <span className={`state-dot state-dot--${snapshot.mode}`} />
        {formatMode(snapshot.mode)}
      </strong>
    </div>
  );
}

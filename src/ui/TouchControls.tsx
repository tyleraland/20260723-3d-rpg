import { simulation } from '../simulation/Simulation';
import { useUiStore } from '../state/uiStore';

export function TouchControls() {
  const selectedEntityId = useUiStore((state) => state.selectedEntityId);
  if (selectedEntityId === null) return null;

  return (
    <div className="touch-controls" aria-label="Selected character actions">
      <button
        type="button"
        className="action-button action-button--move"
        onPointerDown={(event) => {
          event.stopPropagation();
          simulation.setRandomDestination(selectedEntityId);
        }}
      >
        <span className="action-button__icon" aria-hidden="true">
          ↗
        </span>
        New patrol
      </button>
      <button
        type="button"
        className="action-button action-button--attack"
        onPointerDown={(event) => {
          event.stopPropagation();
          simulation.requestAttack(selectedEntityId);
        }}
      >
        <span className="action-button__icon action-button__icon--sword" aria-hidden="true">
          †
        </span>
        Strike
      </button>
    </div>
  );
}

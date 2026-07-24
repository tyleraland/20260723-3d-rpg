import type { MenuTab } from '../state/uiStore';
import { useUiStore } from '../state/uiStore';
import { SelectedEntityPanel } from './SelectedEntityPanel';

const tabs: Array<{ id: MenuTab; label: string; shortLabel: string }> = [
  { id: 'characters', label: 'Characters', shortLabel: 'Party' },
  { id: 'objects', label: 'Objects', shortLabel: 'World' },
  { id: 'debug', label: 'Debug', shortLabel: 'Stats' }
];

export function TopMenu() {
  const activeTab = useUiStore((state) => state.activeTab);
  const setActiveTab = useUiStore((state) => state.setActiveTab);
  const assetStatus = useUiStore((state) => state.assetStatus);

  return (
    <header className="top-menu">
      <div className="brand-lockup" aria-label="Ashfall Patrol">
        <span className="brand-mark" aria-hidden="true">
          AP
        </span>
        <span className="brand-copy">
          <strong>Ashfall</strong>
          <small>Western watch</small>
        </span>
      </div>

      <nav className="menu-tabs" aria-label="Game menu">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={activeTab === tab.id ? 'menu-tab menu-tab--active' : 'menu-tab'}
            onClick={() => setActiveTab(tab.id)}
            aria-pressed={activeTab === tab.id}
            aria-label={tab.label}
          >
            <span className="menu-tab__full">{tab.label}</span>
            <span className="menu-tab__short">{tab.shortLabel}</span>
          </button>
        ))}
      </nav>

      <SelectedEntityPanel />
      <div
        className={`asset-led asset-led--${assetStatus}`}
        title={
          assetStatus === 'ready' ? 'Rigged Quaternius models loaded' : 'Procedural model mode'
        }
      />
    </header>
  );
}

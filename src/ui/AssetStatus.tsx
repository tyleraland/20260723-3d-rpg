import { useUiStore } from '../state/uiStore';

export function AssetStatus() {
  const status = useUiStore((state) => state.assetStatus);
  const message = useUiStore((state) => state.assetMessage);

  if (status === 'ready') return null;
  return (
    <div className={`asset-status asset-status--${status}`} role="status">
      <span className="asset-status__sigil" aria-hidden="true">
        {status === 'loading' ? '…' : '!'}
      </span>
      <span>
        <strong>{status === 'loading' ? 'Preparing the patrol' : 'Procedural squad active'}</strong>
        {message && <small>{message}</small>}
      </span>
    </div>
  );
}

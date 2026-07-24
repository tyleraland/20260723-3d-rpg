import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { loadAssetManifest } from '../assets/AssetLoader';
import { useUiStore } from '../state/uiStore';
import { AssetStatus } from '../ui/AssetStatus';
import { DebugOverlay } from '../ui/DebugOverlay';
import { TopMenu } from '../ui/TopMenu';
import { TouchControls } from '../ui/TouchControls';
import { GameViewport } from '../viewport/GameViewport';
import './App.css';

export function App() {
  const debugVisible = useUiStore((state) => state.debugVisible);
  const setAssetResult = useUiStore((state) => state.setAssetResult);
  const setUpdateAvailable = useUiStore((state) => state.setUpdateAvailable);

  useEffect(() => {
    const controller = new AbortController();
    void loadAssetManifest(controller.signal).then((result) => {
      if (result.status === 'ready') {
        setAssetResult({ status: 'ready', manifest: result.manifest });
      } else {
        setAssetResult({ status: 'placeholder', manifest: null, message: result.message });
      }
    });
    return () => controller.abort();
  }, [setAssetResult]);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    registerSW({
      immediate: false,
      onNeedRefresh: () => setUpdateAvailable(true)
    });
  }, [setUpdateAvailable]);

  useEffect(() => {
    const preventGesture = (event: Event) => event.preventDefault();
    document.addEventListener('gesturestart', preventGesture, { passive: false });
    document.addEventListener('gesturechange', preventGesture, { passive: false });
    return () => {
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
    };
  }, []);

  return (
    <div className="app">
      <TopMenu />
      <div className="game-shell">
        <GameViewport />
        <AssetStatus />
        {debugVisible && <DebugOverlay />}
        <TouchControls />
        <div className="terrain-label terrain-label--west" aria-hidden="true">
          Western March
        </div>
        <div className="terrain-label terrain-label--east" aria-hidden="true">
          Old Trade Road
        </div>
      </div>
    </div>
  );
}

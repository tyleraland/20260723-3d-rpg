import { create } from 'zustand';
import type { AssetManifest } from '../assets/AssetManifest';

export type MenuTab = 'characters' | 'objects' | 'debug';
export type SelectedObject = { id: string; label: string };

type UiState = {
  activeTab: MenuTab;
  selectedEntityId: number | null;
  selectedObject: SelectedObject | null;
  debugVisible: boolean;
  assetStatus: 'loading' | 'ready' | 'placeholder';
  assetMessage: string | null;
  assetManifest: AssetManifest | null;
  updateAvailable: boolean;
  setActiveTab: (tab: MenuTab) => void;
  selectEntity: (id: number) => void;
  selectObject: (object: SelectedObject) => void;
  clearSelection: () => void;
  setDebugVisible: (visible: boolean) => void;
  setAssetResult: (result: {
    status: 'ready' | 'placeholder';
    manifest: AssetManifest | null;
    message?: string;
  }) => void;
  setUpdateAvailable: (available: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  activeTab: 'characters',
  selectedEntityId: null,
  selectedObject: null,
  debugVisible: false,
  assetStatus: 'loading',
  assetMessage: null,
  assetManifest: null,
  updateAvailable: false,
  setActiveTab: (tab) =>
    set((state) => ({
      activeTab: tab,
      debugVisible: tab === 'debug' ? !state.debugVisible : state.debugVisible
    })),
  selectEntity: (id) =>
    set({ selectedEntityId: id, selectedObject: null, activeTab: 'characters' }),
  selectObject: (object) =>
    set({ selectedObject: object, selectedEntityId: null, activeTab: 'objects' }),
  clearSelection: () => set({ selectedEntityId: null, selectedObject: null }),
  setDebugVisible: (debugVisible) => set({ debugVisible }),
  setAssetResult: ({ status, manifest, message }) =>
    set({ assetStatus: status, assetManifest: manifest, assetMessage: message ?? null }),
  setUpdateAvailable: (updateAvailable) => set({ updateAvailable })
}));

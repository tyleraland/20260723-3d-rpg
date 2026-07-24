import type { AssetManifest } from './AssetManifest';

export type AssetLoadResult =
  | { status: 'ready'; manifest: AssetManifest }
  | { status: 'placeholder'; manifest: null; message: string };

export async function loadAssetManifest(signal?: AbortSignal): Promise<AssetLoadResult> {
  const url = `${import.meta.env.BASE_URL}processed-assets/asset-manifest.json`;
  try {
    const response = await fetch(url, { cache: 'no-store', signal });
    if (!response.ok) {
      return {
        status: 'placeholder',
        manifest: null,
        message: 'Quaternius assets are not built. Run npm run assets:build for the rigged squad.'
      };
    }
    const manifest = (await response.json()) as AssetManifest;
    const warrior = manifest.assets.find((asset) => asset.id === 'warrior');
    if (!warrior) throw new Error('The warrior manifest entry is missing.');
    return { status: 'ready', manifest };
  } catch (error) {
    if (signal?.aborted) throw error;
    return {
      status: 'placeholder',
      manifest: null,
      message: `Processed assets could not be loaded. Procedural squad enabled. ${String(error)}`
    };
  }
}

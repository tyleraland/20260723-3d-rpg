import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assetSources } from './asset-manifest.ts';

type GeneratedManifest = {
  version: number;
  assets: Array<{
    id: string;
    url: string;
    animations: Record<string, string>;
  }>;
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const manifestPath = resolve(root, 'public/processed-assets/asset-manifest.json');

if (!existsSync(manifestPath)) {
  throw new Error('Processed asset manifest is missing. Run npm run assets:build first.');
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as GeneratedManifest;
if (manifest.version !== 1)
  throw new Error(`Unsupported asset manifest version: ${manifest.version}`);

for (const definition of assetSources) {
  const asset = manifest.assets.find((candidate) => candidate.id === definition.id);
  if (!asset) throw new Error(`Manifest entry is missing for ${definition.id}.`);
  for (const clip of ['idle', 'walk', 'attack']) {
    if (asset.animations[clip] !== clip) {
      throw new Error(`${definition.id}: normalized ${clip} animation is missing.`);
    }
  }

  const file = resolve(root, 'public', asset.url);
  if (!existsSync(file))
    throw new Error(`${definition.id}: generated GLB is missing at ${asset.url}.`);
  const size = statSync(file).size;
  if (size < 1024) throw new Error(`${definition.id}: generated GLB is unexpectedly small.`);
  if (size > 10 * 1024 * 1024) throw new Error(`${definition.id}: generated GLB exceeds 10 MB.`);
  console.log(`${definition.id}: ${(size / 1024).toFixed(0)} KB — valid`);
}

console.log('Processed assets are valid.');

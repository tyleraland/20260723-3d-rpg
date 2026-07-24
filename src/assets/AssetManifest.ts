import type { NormalizedAnimationName } from './animationNames';

export type CharacterAssetDefinition = {
  id: string;
  kind: 'character';
  url: string;
  scale: number;
  rotationY: number;
  animations: Record<NormalizedAnimationName, string>;
};

export type MonsterAssetDefinition = Omit<CharacterAssetDefinition, 'kind'> & {
  kind: 'monster';
};

export type AssetDefinition = CharacterAssetDefinition | MonsterAssetDefinition;

export type AssetManifest = {
  version: number;
  generatedAt: string;
  assets: AssetDefinition[];
};

export function resolveAssetUrl(url: string) {
  return `${import.meta.env.BASE_URL}${url.replace(/^\//, '')}`;
}

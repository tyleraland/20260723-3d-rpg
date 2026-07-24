export type AssetSourceDefinition = {
  id: string;
  kind: 'character' | 'monster';
  sourcePath: string;
  archiveGlob: string;
  archiveEntry: string;
  outputFile: string;
  scale: number;
  rotationY: number;
  animations: Record<'idle' | 'walk' | 'attack', string>;
  requiredNodes?: string[];
};

export const assetSources: AssetSourceDefinition[] = [
  {
    id: 'warrior',
    kind: 'character',
    sourcePath: 'source-assets/quaternius-rpg-characters/Warrior.gltf',
    archiveGlob: 'RPG Characters*.zip',
    archiveEntry: 'RPG Characters - Nov 2020/glTF/Warrior.gltf',
    outputFile: 'characters/warrior.glb',
    scale: 0.72,
    rotationY: Math.PI,
    animations: { idle: 'Idle', walk: 'Walk', attack: 'Sword_Attack' },
    requiredNodes: ['CharacterArmature', 'Weapon.R', 'Warrior_Sword']
  },
  {
    id: 'orc',
    kind: 'monster',
    sourcePath: 'source-assets/quaternius-ultimate-monsters/Orc.gltf',
    archiveGlob: 'Ultimate Monsters*.zip',
    archiveEntry: 'Ultimate Monsters/Blob/glTF/Orc.gltf',
    outputFile: 'monsters/orc.glb',
    scale: 0.8,
    rotationY: Math.PI,
    animations: { idle: 'Idle', walk: 'Walk', attack: 'Bite_Front' },
    requiredNodes: ['CharacterArmature']
  }
];

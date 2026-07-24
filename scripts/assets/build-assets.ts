import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { assetSources, type AssetSourceDefinition } from './asset-manifest.ts';

type GltfDocument = {
  animations?: Array<{ name?: string }>;
  nodes?: Array<{ name?: string }>;
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const outputRoot = resolve(root, 'public/processed-assets');

function wildcardMatches(filename: string, glob: string) {
  const expression = `^${glob.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replaceAll('*', '.*')}$`;
  return new RegExp(expression, 'i').test(filename);
}

function findArchive(glob: string) {
  return readdirSync(root).find((filename) => wildcardMatches(filename, glob));
}

function ensureSource(definition: AssetSourceDefinition) {
  const source = resolve(root, definition.sourcePath);
  if (existsSync(source)) return source;

  const archiveName = findArchive(definition.archiveGlob);
  if (!archiveName) {
    throw new Error(
      [
        `Missing source asset: ${definition.sourcePath}`,
        `Extract the Quaternius pack as documented in source-assets/README.md,`,
        `or place an archive matching "${definition.archiveGlob}" in the project root.`
      ].join('\n')
    );
  }

  mkdirSync(dirname(source), { recursive: true });
  try {
    const contents = execFileSync(
      'unzip',
      ['-p', resolve(root, archiveName), definition.archiveEntry],
      { maxBuffer: 32 * 1024 * 1024 }
    );
    if (!contents.length) throw new Error('The archive entry was empty.');
    writeFileSync(source, new Uint8Array(contents));
    console.log(`Extracted ${definition.id} from ${archiveName}`);
  } catch (error) {
    throw new Error(
      `Could not extract ${definition.archiveEntry} from ${archiveName}. ` +
        `Extract the pack manually into source-assets/.\n${String(error)}`
    );
  }
  return source;
}

function normalizeSource(source: string, definition: AssetSourceDefinition, temporaryRoot: string) {
  const document = JSON.parse(readFileSync(source, 'utf8')) as GltfDocument;
  const nodes = new Set(document.nodes?.map((node) => node.name).filter(Boolean));
  const clipsByName = new Map(document.animations?.map((clip) => [clip.name, clip]));

  for (const nodeName of definition.requiredNodes ?? []) {
    if (!nodes.has(nodeName)) {
      throw new Error(`${definition.id}: required rig node "${nodeName}" was not found.`);
    }
  }

  const normalizedAnimations = Object.entries(definition.animations).map(
    ([normalizedName, sourceName]) => {
      const clip = clipsByName.get(sourceName);
      if (!clip)
        throw new Error(`${definition.id}: required animation "${sourceName}" was not found.`);
      return { ...clip, name: normalizedName };
    }
  );

  document.animations = normalizedAnimations;
  const normalizedPath = resolve(temporaryRoot, `${definition.id}.gltf`);
  writeFileSync(normalizedPath, JSON.stringify(document));
  return normalizedPath;
}

function runOptimizer(input: string, output: string) {
  const executable = resolve(
    root,
    'node_modules/.bin',
    process.platform === 'win32' ? 'gltf-transform.cmd' : 'gltf-transform'
  );
  if (!existsSync(executable)) {
    throw new Error(
      'glTF Transform is not installed. Run npm install before npm run assets:build.'
    );
  }

  mkdirSync(dirname(output), { recursive: true });
  execFileSync(
    executable,
    ['optimize', input, output, '--compress', 'meshopt', '--texture-compress', 'webp'],
    { cwd: root, stdio: 'inherit' }
  );
}

const temporaryRoot = resolve(tmpdir(), `ashfall-assets-${process.pid}`);
mkdirSync(temporaryRoot, { recursive: true });

try {
  const manifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    assets: [] as Array<{
      id: string;
      kind: 'character' | 'monster';
      url: string;
      scale: number;
      rotationY: number;
      animations: Record<'idle' | 'walk' | 'attack', string>;
    }>
  };

  for (const definition of assetSources) {
    const source = ensureSource(definition);
    const normalized = normalizeSource(source, definition, temporaryRoot);
    const output = resolve(outputRoot, definition.outputFile);
    console.log(`Optimizing ${basename(source)} → ${definition.outputFile}`);
    runOptimizer(normalized, output);
    manifest.assets.push({
      id: definition.id,
      kind: definition.kind,
      url: `processed-assets/${definition.outputFile}`,
      scale: definition.scale,
      rotationY: definition.rotationY,
      animations: { idle: 'idle', walk: 'walk', attack: 'attack' }
    });
  }

  writeFileSync(resolve(outputRoot, 'asset-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Built ${manifest.assets.length} assets and asset-manifest.json`);
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}

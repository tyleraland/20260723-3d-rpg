# Ashfall Patrol

A mobile-first TypeScript PWA prototype built with React, React Three Fiber, and Three.js. A lightweight simulation drives independent characters across a square battlefield while React handles only menus, selection, and debug controls.

## Quick start

```bash
npm install
npm run assets:build
npm run dev
```

Open the local URL printed by Vite. The app also works without processed models by falling back to animated procedural warriors; the header explains how to enable the Quaternius model.

## Source assets

The included build pipeline expects the CC0 Quaternius packs listed below. Original archives, extracted sources, and generated GLBs are deliberately ignored by Git.

1. Put `RPG Characters - Nov 2020` in `source-assets/quaternius-rpg-characters/`.
2. Put `Ultimate Monsters` in `source-assets/quaternius-ultimate-monsters/`.
3. Run `npm run assets:build`.
4. Start the app with `npm run dev`.

As a convenience, when the supplied ZIP files are in the repository root, `assets:build` extracts only `Warrior.gltf` and `Orc.gltf` into those ignored directories before processing them. The original models contain embedded buffers and textures, so no companion files are required.

The pipeline keeps the rig, validates that the warrior sword is attached beneath `Weapon.R`, retains only the required idle/walk/attack clips, normalizes those clip names, optimizes the models with Meshopt compression, and generates `public/processed-assets/asset-manifest.json`.

## Commands

```text
npm run dev              Start the local development server
npm run build            Type-check and build the production PWA
npm run preview          Preview the production build locally
npm run test             Run simulation unit tests
npm run test:e2e         Run the Playwright smoke test
npm run lint             Run ESLint
npm run format           Format source files
npm run assets:build     Build ignored runtime GLBs from local sources
npm run assets:validate  Validate generated assets and manifest
npm run check:repo-size  Enforce repository size limits
```

## GitHub Pages (later)

The Vite config reads `VITE_BASE_PATH`. When Pages deployment is enabled for a project repository, build with the repository name as the base, for example:

```bash
VITE_BASE_PATH=/20260723-3d-rpg/ npm run build
```

Generated production GLBs are not committed. A future Pages workflow should build or download them during deployment.

## Repository policy

- No individual committed file may exceed 10 MB.
- The size check warns above 150 MB total and fails above 900 MB.
- Source packs, archives, generated GLBs, `node_modules`, build output, screenshots, and recordings are ignored.
- No Git LFS is used for milestone one.

Quaternius assets are published under CC0; see the license files in the downloaded packs.

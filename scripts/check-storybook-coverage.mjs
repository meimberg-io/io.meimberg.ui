// PUL-462 (Schritt 5): Storybook-Coverage-Drift-Schutz für @meimberg/ui —
// Pendant zu app/scripts/check-storybook-coverage.ts (PUL-395), reduziert
// auf das Package: jede Komponente in `src/atoms/` und `src/molecules/`
// braucht eine sibling `<Component>.stories.tsx`; umgekehrt darf keine
// Story ohne Komponenten-Sibling existieren (Orphan-Check).
//
// `src/ui/` (shadcn-Vendor-Primitives) ist bewusst NICHT story-pflichtig —
// analog zur App-Config, wo nur die Pulse-Layer geprüft wurden. Keine
// Allowlist: das Package startet vollständig storied und soll so bleiben.
//
// Plain Node (.mjs), kein tsx nötig — läuft via `pnpm run check:stories`
// (Makefile-Target `check-stories` fährt App + Package).

import {readdirSync, statSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC_DIR = path.resolve(dirname, '../src')
const LAYERS = ['atoms', 'molecules', 'organisms']

const IGNORED_FILES = new Set(['index.ts', 'index.tsx', 'icons.ts'])

function isComponentFile(name) {
  if (IGNORED_FILES.has(name)) return false
  if (name.endsWith('.test.tsx') || name.endsWith('.test.ts')) return false
  if (name.endsWith('.stories.tsx') || name.endsWith('.stories.ts')) return false
  return name.endsWith('.tsx')
}

function isStoryFile(name) {
  return name.endsWith('.stories.tsx') || name.endsWith('.stories.ts')
}

function walk(dir) {
  const entries = []
  for (const name of readdirSync(dir)) {
    const abs = path.join(dir, name)
    if (statSync(abs).isDirectory()) {
      entries.push(...walk(abs))
    } else {
      entries.push(abs)
    }
  }
  return entries
}

const missing = []
const orphans = []

for (const layer of LAYERS) {
  const layerDir = path.join(SRC_DIR, layer)
  let files
  try {
    files = walk(layerDir)
  } catch {
    continue // Layer existiert (noch) nicht — z. B. molecules vor Schritt 6.
  }
  const names = new Set(files.map((f) => path.relative(SRC_DIR, f)))
  for (const abs of files) {
    const rel = path.relative(SRC_DIR, abs)
    const base = path.basename(abs)
    if (isComponentFile(base)) {
      const story = rel.replace(/\.tsx$/, '.stories.tsx')
      if (!names.has(story)) missing.push(rel)
    } else if (isStoryFile(base)) {
      const component = rel.replace(/\.stories\.(tsx|ts)$/, '.tsx')
      if (!names.has(component)) orphans.push(rel)
    }
  }
}

if (missing.length || orphans.length) {
  for (const rel of missing) {
    console.error(`✖ Komponente ohne Story: src/${rel} — sibling ${path.basename(rel).replace(/\.tsx$/, '.stories.tsx')} anlegen.`)
  }
  for (const rel of orphans) {
    console.error(`✖ Story ohne Komponente: src/${rel} — Komponenten-Sibling fehlt (verschoben/umbenannt?).`)
  }
  process.exit(1)
}

console.log('✓ @meimberg/ui Storybook-Coverage: alle Komponenten storied, keine Orphans.')

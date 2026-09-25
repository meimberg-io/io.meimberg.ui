#!/usr/bin/env node
// meimberg-ui-check-stories — Storybook-Coverage-Drift-Schutz für @meimberg/ui
// und Consumer-Apps.
//
// Jede Komponenten-Datei (`*.tsx`) in den Layer-Verzeichnissen (Default
// `atoms/`, `molecules/`, `organisms/` unter `src/`) braucht eine sibling
// `<Component>.stories.tsx`. Umgekehrt darf keine Story ohne Komponenten-
// Sibling existieren (Orphan-Check).
//
// Server-Components sind von der Story-Pflicht ausgenommen — sie haben keinen
// Client-Lifecycle und crashen im Storybook beim Mount. Erkannt werden
//   • Dateien mit `import 'server-only'` (als eigene Zeile) und
//   • async Server-Components: kein `'use client'`, aber eine exportierte
//     async Funktion mit PascalCase-Namen.
// Eine Story für eine Server-Component ist ein Fehler (stattdessen den
// Client-Wrapper storien).
//
// Optional: eine Allowlist-JSON (`{"files": ["molecules/Foo.tsx", …]}`, Pfade
// relativ zum Source-Verzeichnis) für Komponenten, die noch keine Story haben.
// Veraltete Einträge (inzwischen storied oder gelöscht) schlagen fehl, damit
// die Liste nur schrumpft.
//
// Plain Node (ESM), keine Dependencies.

import {existsSync, readFileSync, readdirSync} from 'node:fs'
import path from 'node:path'
import {parseArgs} from 'node:util'

const USAGE = `Usage: meimberg-ui-check-stories [options]

Options:
  --root <dir>          Basisverzeichnis für alle relativen Pfade (Default: cwd)
  --src <dir>           Verzeichnis mit den Layer-Ordnern, relativ zu --root (Default: src)
  --layers <list>       Kommagetrennte Layer-Ordner (Default: atoms,molecules,organisms)
  --ignore <list>       Kommagetrennte Dateinamen ohne Story-Pflicht (Default: index.ts,index.tsx,icons.ts)
  --ignore-dirs <list>  Kommagetrennte Ordnernamen, die übersprungen werden (Default: __tests__)
  --allowlist <file>    Allowlist-JSON {"files": [...]}, relativ zu --root; Einträge relativ zu --src
  -h, --help            Diese Hilfe`

const list = (value) => value.split(',').map((s) => s.trim()).filter(Boolean)

const {values: args} = parseArgs({
  options: {
    root: {type: 'string', default: process.cwd()},
    src: {type: 'string', default: 'src'},
    layers: {type: 'string', default: 'atoms,molecules,organisms'},
    ignore: {type: 'string', default: 'index.ts,index.tsx,icons.ts'},
    'ignore-dirs': {type: 'string', default: '__tests__'},
    allowlist: {type: 'string'},
    help: {type: 'boolean', short: 'h', default: false},
  },
})

if (args.help) {
  console.log(USAGE)
  process.exit(0)
}

const ROOT = path.resolve(args.root)
const SRC_DIR = path.resolve(ROOT, args.src)
const LAYERS = list(args.layers)
const IGNORED_FILES = new Set(list(args.ignore))
const IGNORED_DIRS = new Set(list(args['ignore-dirs']))
const ALLOWLIST_FILE = args.allowlist ? path.resolve(ROOT, args.allowlist) : undefined

// Anzeige-Pfade relativ zum Aufruf-Verzeichnis, damit Meldungen klickbar sind.
const show = (abs) => path.relative(process.cwd(), abs) || '.'
const showSrc = (rel) => show(path.join(SRC_DIR, rel))

const isStoryFile = (name) => name.endsWith('.stories.tsx') || name.endsWith('.stories.ts')

function isComponentFile(name) {
  if (IGNORED_FILES.has(name)) return false
  if (name.endsWith('.test.tsx') || name.endsWith('.test.ts')) return false
  if (isStoryFile(name)) return false
  return name.endsWith('.tsx')
}

const SERVER_ONLY_IMPORT = /^\s*import\s+['"]server-only['"]/m
const USE_CLIENT_DIRECTIVE = /^\s*['"]use client['"]/m
const ASYNC_COMPONENT_EXPORT =
  /^\s*export\s+(?:default\s+)?async\s+function\s+[A-Z]|^\s*export\s+const\s+[A-Z]\w*\s*(?::[^=]+)?=\s*async\b/m

function isServerComponent(absPath) {
  const source = readFileSync(absPath, 'utf8')
  if (SERVER_ONLY_IMPORT.test(source)) return true
  return !USE_CLIENT_DIRECTIVE.test(source) && ASYNC_COMPONENT_EXPORT.test(source)
}

function walk(dir, rel, out) {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue
      walk(path.join(dir, entry.name), path.join(rel, entry.name), out)
      continue
    }
    if (!entry.isFile()) continue
    const relPath = path.join(rel, entry.name)
    if (isComponentFile(entry.name)) {
      if (isServerComponent(path.join(dir, entry.name))) out.serverOnly.push(relPath)
      else out.components.push(relPath)
    } else if (isStoryFile(entry.name)) {
      out.stories.push(relPath)
    }
  }
}

const storyFileFor = (componentRel) => componentRel.replace(/\.tsx$/, '.stories.tsx')
const componentFileFor = (storyRel) => storyRel.replace(/\.stories\.tsx?$/, '.tsx')

function loadAllowlist() {
  if (!ALLOWLIST_FILE) return new Set()
  if (!existsSync(ALLOWLIST_FILE)) {
    console.error(`[check-stories] Allowlist nicht gefunden: ${show(ALLOWLIST_FILE)}`)
    process.exit(2)
  }
  const parsed = JSON.parse(readFileSync(ALLOWLIST_FILE, 'utf8'))
  if (!Array.isArray(parsed.files)) {
    console.error(`[check-stories] Allowlist ${show(ALLOWLIST_FILE)}: Feld "files" (string[]) fehlt.`)
    process.exit(2)
  }
  return new Set(parsed.files)
}

const out = {components: [], stories: [], serverOnly: []}
const checkedLayers = LAYERS.filter((layer) => existsSync(path.join(SRC_DIR, layer)))
if (checkedLayers.length === 0) {
  console.error(`[check-stories] Keiner der Layer (${LAYERS.join(', ')}) existiert unter ${show(SRC_DIR)} — --root/--src prüfen.`)
  process.exit(2)
}
for (const layer of checkedLayers) walk(path.join(SRC_DIR, layer), layer, out)

const componentSet = new Set(out.components)
const storySet = new Set(out.stories)
const serverOnlySet = new Set(out.serverOnly)
const allowlist = loadAllowlist()
const allowlistName = ALLOWLIST_FILE ? show(ALLOWLIST_FILE) : undefined

const missingAll = out.components.filter((c) => !storySet.has(storyFileFor(c)))
const missing = missingAll.filter((f) => !allowlist.has(f))
const allowlistedMissing = missingAll.filter((f) => allowlist.has(f))
const staleResolved = [...allowlist].filter((f) => componentSet.has(f) && storySet.has(storyFileFor(f)))
const staleDeleted = [...allowlist].filter((f) => !componentSet.has(f))

const orphans = []
const serverOnlyWithStory = []
for (const story of out.stories) {
  const sibling = componentFileFor(story)
  if (serverOnlySet.has(sibling)) serverOnlyWithStory.push(story)
  else if (!componentSet.has(sibling)) orphans.push(story)
}

const failures = []
const bullets = (files, fmt = showSrc) => files.map((f) => `  - ${fmt(f)}`).join('\n')

if (missing.length > 0) {
  failures.push(
    `Komponente ohne Story (${missing.length}):\n${bullets(missing)}\n` +
      `  Sibling <Component>.stories.tsx anlegen${allowlistName ? ` oder den Pfad in ${allowlistName} aufnehmen` : ''}.`,
  )
}
if (orphans.length > 0) {
  failures.push(`Story ohne Komponente (${orphans.length}):\n${bullets(orphans)}\n  Komponenten-Sibling fehlt (verschoben/umbenannt?) — Story löschen oder umbenennen.`)
}
if (serverOnlyWithStory.length > 0) {
  failures.push(
    `Story für Server-Component (${serverOnlyWithStory.length}):\n${bullets(serverOnlyWithStory)}\n` +
      "  Server-Components (`import 'server-only'` oder async ohne 'use client') haben keinen\n" +
      '  Client-Lifecycle — die Story crasht beim Mount. Story löschen und stattdessen den\n' +
      '  Client-Wrapper storien.',
  )
}
if (staleResolved.length > 0) {
  failures.push(`Allowlist-Einträge sind inzwischen storied — aus ${allowlistName} entfernen (${staleResolved.length}):\n${bullets(staleResolved, (f) => f)}`)
}
if (staleDeleted.length > 0) {
  failures.push(`Allowlist-Einträge zeigen auf nicht (mehr) existierende Komponenten — aus ${allowlistName} entfernen (${staleDeleted.length}):\n${bullets(staleDeleted, (f) => f)}`)
}

if (failures.length > 0) {
  console.error('\n[check-stories] FAIL\n')
  for (const f of failures) console.error(`${f}\n`)
  process.exit(1)
}

const covered = out.components.length - allowlistedMissing.length
console.log(
  `[check-stories] OK — ${covered}/${out.components.length} Komponente(n) storied (${checkedLayers.join('/')} unter ${show(SRC_DIR)}); ` +
    `${allowlistedMissing.length} auf der Allowlist; ${out.stories.length} Story-Datei(en); ` +
    `${out.serverOnly.length} Server-Component(s) ausgenommen.`,
)

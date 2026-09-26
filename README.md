# @meimberg/ui

Produktneutrales Design-System (Komponenten) auf Basis von `@meimberg/ui/tokens` (Foundations). Aus der Pulse-App extrahiert, damit weitere Apps dasselbe Look-and-Feel — inklusive App-Gerüst — ohne Copy-Paste konsumieren können. Wird von der App via Next `transpilePackages` aus der Quelle gebaut (kein separater Build-Step).

**Domain-frei:** kein Import aus einem App-Baum (`@/*`), keine Fachlichkeit — erzwungen per `eslint.config.mjs` + `tsc`. Produktspezifische Semantik (bei Pulse: Prio-/Stage-/Vokabular-Farb-Tokens, Auth, Queries) bleibt in der jeweiligen App.

## Struktur

Atomic Design, geschnitten nach **Komposition**:

- `src/ui/` — reine shadcn-/Radix-Vendor-Primitives (Dialog, Popover, Sheet, Sidebar, Card, …). Eigenbauten liegen nie hier; Abweichungen von Upstream stehen unter „Vendor-Änderungen".
- `src/atoms/` — **ein Element**: Controls (`Button`, `IconButton`, `Select`, `Combobox`, `TextField`, `DatePicker`, `SearchInput`, `SegmentedControl`, `Chip`, `ThemeToggle`, …), Anzeige (`Badge`, `Avatar`, `Icon`, `IconByName`, `Donut`, `Sparkline`, …), Layout-Primitives (`PageContainer`, `ScrollableContent`) und `atoms/icons` (Lucide-Re-Export plus semantische Aliase).
- `src/molecules/` — **Kompositionen aus 2+ Elementen** (`FormField`/`FormRow`/`FormSection`, `FormActions`, `FilterBar`, `KpiTile`, `EmptyState`, `PageHeader`, `CardActions`, …).
- `src/organisms/` — **App-Gerüst und große Kompositionen** (`AppShell`, `AppSidebar`, `Breadcrumbs`, `UserMenu`, `SubNavLayout`, `FormDialog`, `DataTable`, `IconUploadCropDialog`, `markdown-editor`, …).

## Import-Pfade

| Import | Inhalt |
| --- | --- |
| `@meimberg/ui` | Root-Barrel: alle Atoms, Molecules und Organisms außer den schweren Subpaths unten, dazu `cn`, `useIsMobile`, `UiProviders`, die i18n-Hooks, `Toaster`/`toast` und die Vokabular-Typen (`ControlSize`, `Tone`, `Breakpoint`, `IconComponent`). |
| `@meimberg/ui/atoms/icons` | Lucide-Icons plus semantische Aliase (`SaveIcon`, `DeleteIcon`, `EditIcon`, `AddIcon`, `CloseIcon`, `CancelIcon`, `OpenExternalIcon`); separates Barrel wegen Namens-Kollisionen. |
| `@meimberg/ui/organisms/markdown-editor` · `@meimberg/ui/molecules/markdown-renderer` · `@meimberg/ui/molecules/icon-picker` | Schwere Bundles (TipTap, react-markdown, komplette Lucide-Registry) — bewusst nur per Subpath. |
| `@meimberg/ui/ui/*` | Einzelne Vendor-Primitives (`dialog`, `popover`, `card`, `alert-dialog`, …) für Fälle ohne eigene Komponente. |
| `@meimberg/ui/providers` | Provider-Contract (`UiProviders`). |
| `@meimberg/ui/i18n/de` | Deutsches Sprachpaket (`de` für `<UiProviders {...de}>`). |
| `@meimberg/ui/tokens` | Foundations/Preset (Tailwind-v4-Tokens, Custom-Variants, Base-Resets, Utilities) — als CSS `@import`. |
| `@meimberg/ui/eslint` | ESLint-Regeln für Apps (siehe § ESLint-Regeln für Apps). |
| `@meimberg/ui/styles.css` | Stylesheet des DS-Storybooks (Tailwind + Tokens + Radix-Animationen). |
| `@meimberg/ui/testing` · `@meimberg/ui/testing/setup` | Test-Helper (`renderWithUi`) und Vitest-Setup (jest-dom + jsdom-Polyfills), siehe „Testen in Apps". |

## Getting Started — neue App aufsetzen

Voraussetzungen: Next.js (App Router), React 19, Tailwind CSS v4. Eine lauffähige Vorlage mit allen Schritten liegt unter [`examples/next-starter/`](examples/next-starter/); CI baut sie bei jedem Push und Tag.

### 1. Dependencies

```jsonc
// package.json der App
"dependencies": {
  "@meimberg/ui": "github:meimberg-io/io.meimberg.ui#v1.3.0",
  "next-themes": "^0.4.6",
  "sonner": "^1.7.4"
},
"devDependencies": {
  "tailwindcss": "^4",
  "@tailwindcss/postcss": "^4",
  "tw-animate-css": "^1.4.0",
  "@tailwindcss/typography": "^0.5"   // nur für MarkdownRenderer/-Editor
}
```

`next-themes` und `sonner` sind Peers: Die App installiert sie selbst, damit es genau eine Instanz von Theme-Context und Toast-Store gibt. Das Tag immer auf ein Release pinnen, siehe [CHANGELOG](CHANGELOG.md).

### 2. Next- und PostCSS-Konfiguration

Das Package wird als TypeScript-Quelle ausgeliefert, die App baut es mit:

```ts
// next.config.ts
const nextConfig = { transpilePackages: ['@meimberg/ui'] }
export default nextConfig
```

```js
// postcss.config.mjs
export default { plugins: { '@tailwindcss/postcss': {} } }
```

### 3. Stylesheet

```css
/* app/globals.css */
@import "tailwindcss";
@import "@meimberg/ui/tokens";
@import "./brand.css";          /* optional: eigene Marke, siehe unten */
@import "tw-animate-css";
@plugin "@tailwindcss/typography";   /* nur mit MarkdownRenderer/-Editor */
```

`@meimberg/ui/tokens` bringt ein `@source` auf die Package-Quelle mit. Tailwind generiert dadurch auch die Utility-Klassen, die nur in DS-Komponenten vorkommen; ein eigenes `@source` in der App ist nicht nötig.

`@meimberg/ui/styles.css` ist das Stylesheet des DS-Storybooks und bringt ein eigenes `@import "tailwindcss"` mit. Nicht zusätzlich zur eigenen `globals.css` importieren.

### 4. Eigene Marke und Produkt-Tokens

Die mitgelieferte Palette ist neutral: Slate-Grautöne und ein blaues Primary. Eine App setzt ihre Marke, indem sie Tokens nach dem Tokens-Import überschreibt. Farb-Tokens sind HSL-Kanäle ohne `hsl()` (`--primary: 262 70% 50%`), jeweils in `:root` (hell) und `.dark`.

| Was | Tokens |
| --- | --- |
| Markenfarbe | `--primary`, `--primary-foreground`, `--ring`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-ring` |
| Grautöne und Flächen | `--background`, `--foreground`, `--card`, `--popover`, `--secondary`, `--muted`, `--accent`, `--border`, `--input`, `--surface-0` … `--surface-3`, `--sidebar-*` (jeweils mit `-foreground`) |
| Status | `--success`, `--warning`, `--info`, `--destructive` (jeweils mit `-foreground`) |
| Radius | `--radius` (Basis; `rounded-sm/md/lg/xl/2xl`, Form-Felder und Dialoge leiten sich davon ab) |
| Typografie | `--type-<rolle>-size` / `--type-<rolle>-leading` für `heading-1`, `heading-2`, `heading-3`, `body`, `body-sm`, `caption` |
| Schrift | `--font-inter` (per `next/font`, siehe Schritt 5) oder direkt `--font-sans` in einem eigenen `@theme` |

```css
/* app/brand.css */
:root { --primary: 262 70% 50%; --ring: 262 70% 50%; --sidebar-primary: 262 70% 50%; --sidebar-ring: 262 70% 50%; --radius: 0.375rem; }
.dark { --primary: 262 80% 68%; --ring: 262 80% 68%; --sidebar-primary: 262 80% 68%; --sidebar-ring: 262 80% 68%; }
```

Dark Mode hängt an der Klasse `.dark` auf `<html>`; `UiProviders` konfiguriert next-themes entsprechend. Im DS-Storybook zeigt der Theme-Switch neben hell/dunkel eine Demo-Marke.

Eigene semantische Tokens (bei Pulse z. B. Prioritäts- und Stage-Farben) gehören nicht ins Package. Die App legt sie in einer eigenen Datei an: Werte in `:root`/`.dark`, dazu ein `@theme inline`-Block, der sie als Tailwind-Farben verfügbar macht (`--color-p1: hsl(var(--p1));`). Diese Datei per `@import` einbinden: Ein zweiter `@theme inline`-Block direkt in der Einstiegsdatei wird von Tailwind v4 nicht zuverlässig gemergt.

### 5. Root-Layout, Font und Provider

Die Tokens erwarten die Schrift in der CSS-Variable `--font-inter`:

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

```tsx
// app/providers.tsx
'use client'

import type { ReactNode } from 'react'
import { Toaster, UiProviders } from '@meimberg/ui'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UiProviders>
      {children}
      <Toaster />
    </UiProviders>
  )
}
```

`UiProviders` bündelt die Contexts, die das DS voraussetzt: next-themes `ThemeProvider` (Dark Mode über die Klasse `.dark`, Default `system`), Radix `TooltipProvider` und den Sprach-Context (siehe Schritt 8). Der `Toaster` muss innerhalb sitzen, sonst folgt er dem Theme nicht. `ThemeToggle` bietet Hell/Dunkel/System an.

### 6. App-Gerüst (Navigation)

Die Shell ist config-getrieben. Routing kommt von außen: der aktuelle Pfad als Prop, Links über den `linkComponent`-Slot.

```tsx
// app/shell.tsx
'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AppShell, AppSidebar, Breadcrumbs, ThemeToggle, UserMenu, type SidebarNavGroup } from '@meimberg/ui'
import { House, Settings } from '@meimberg/ui/atoms/icons'

const groups: SidebarNavGroup[] = [{
  label: 'Navigation',
  items: [
    { label: 'Home', href: '/', icon: <House className="h-4 w-4" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="h-4 w-4" /> },
  ],
}]

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname()
  return (
    <AppShell
      sidebar={
        <AppSidebar
          groups={groups}
          currentPath={path}
          linkComponent={Link}
          header={({ collapsed }) => <span className="heading-3">{collapsed ? 'A' : 'App'}</span>}
          footer={({ collapsed }) => <UserMenu name="Ada Lovelace" email="ada@example.com" collapsed={collapsed} linkComponent={Link} />}
        />
      }
      headerStart={<Breadcrumbs rootLabel="App" rootHref="/" items={[{ label: 'Home' }]} linkComponent={Link} />}
      headerEnd={<ThemeToggle />}
    >
      {children}
    </AppShell>
  )
}
```

`header`/`footer` bekommen `{ collapsed, isMobile, closeMobile }` — `closeMobile()` schließt die Sidebar auf dem Handy, z. B. nach einer Aktion im Footer. Sekundär-Navigation (Settings-Stil): `<SubNavLayout items currentPath linkComponent onNavigate>`. Filterleisten: `<FilterBar>` mit `<Select variant="pill">`, `<Chip>` und `<SearchInput size="xs">`. Fehlerseite: `app/error.tsx` rendert `<RouteErrorState error reset />`.

### 7. Toast

Den `<Toaster />` einmal in den Providern mounten (Schritt 5). Toasts auslösen:

```tsx
import { toast } from '@meimberg/ui'
toast.success('Gespeichert')
```

### 8. Sprache

Alle Komponenten-Texte (Beschriftungen, Platzhalter, `aria-label`) sind englisch. Deutsch kommt als mitgeliefertes Paket:

```tsx
import { de } from '@meimberg/ui/i18n/de'

<UiProviders {...de}>…</UiProviders>   // Labels, Zahlen-/Datumsformat (de-DE) und Kalender-Locale
```

Einzelne Texte lassen sich an zwei Stellen überschreiben, die spätere gewinnt:

1. App-weit: `<UiProviders {...de} messages={{ ...de.messages, kpiTile: { comparison: 'vs. letzte Woche' } }}>`.
2. Pro Instanz: jede Komponente mit Text hat eine `labels`-Prop, z. B. `<DatePicker labels={{ placeholder: 'Fälligkeit wählen' }} />`.

Die Label-Typen heißen `<Komponente>Labels` (z. B. `DatePickerLabels`), der Gesamt-Typ ist `UiMessages`. Eigene Komponenten einer App können denselben Mechanismus über `useLabels`, `useUiLocale` und `useDateLocale` nutzen.

## Testen in Apps

Das Package bringt das Test-Setup mit, das es selbst nutzt. Voraussetzung sind die optionalen Peers `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom` und `@testing-library/user-event` als devDependencies der App.

**Setup.** `@meimberg/ui/testing/setup` registriert die jest-dom-Matcher und polyfillt in jsdom fehlende Browser-APIs (`matchMedia`, `ResizeObserver`, Pointer-Capture, `scrollIntoView`, Range-Rects). Es polyfillt nur, was fehlt.

```ts
// vitest.config.ts: test: { environment: 'jsdom', globals: true, setupFiles: ['./vitest.setup.ts'] }
// vitest.setup.ts
import '@meimberg/ui/testing/setup'
// … danach app-eigene Mocks
```

**Rendern.** `renderWithUi(ui, options?)` mountet in `UiProviders` und gibt das Testing-Library-Ergebnis plus eine `userEvent`-Instanz (`user`) zurück.

| Option | Wirkung |
| --- | --- |
| `providers` | Komplette `UiProviders`-Props (`theme`, `locale`, `dateLocale`, `messages`, `tooltipDelayDuration`), z. B. `{...de}`. |
| `messages` · `locale` · `dateLocale` | Kurzformen, gewinnen gegen `providers`. |
| `withToaster` | `<Toaster>` innerhalb der Provider mitmounten (Default `false`). |
| `wrapper` | App-Provider (QueryClient, …), liegt außen um `UiProviders`. |
| übrige | Wie `render()` von Testing Library (`container`, `baseElement`, …). |

```tsx
import { de } from '@meimberg/ui/i18n/de'
import { renderWithUi } from '@meimberg/ui/testing'

const { user } = renderWithUi(<MyForm />, { providers: de, wrapper: QueryWrapper })
await user.click(screen.getByRole('button', { name: 'Speichern' }))
```

Ein app-eigener Helper baut darauf auf und ergänzt nur, was die App zusätzlich braucht (Pulse: `renderWithProviders` mit QueryClient).

**Story-Pflicht prüfen.** Das Bin `meimberg-ui-check-stories` (plain Node, keine Dependencies) prüft, dass jede `.tsx` in den Layer-Ordnern eine sibling `.stories.tsx` hat und keine Story ohne Komponente existiert. Server-Components sind ausgenommen (`import 'server-only'` oder async-Export ohne `'use client'`); eine Story für sie ist ein Fehler.

```jsonc
// package.json der App
"scripts": { "check:stories": "meimberg-ui-check-stories --src src/components --allowlist scripts/check-stories-allowlist.json" }
```

| Option | Default |
| --- | --- |
| `--root <dir>` | Aufruf-Verzeichnis; Basis aller relativen Pfade |
| `--src <dir>` | `src` |
| `--layers <liste>` | `atoms,molecules,organisms` (fehlende Ordner werden übersprungen, keiner vorhanden ist ein Fehler) |
| `--ignore <liste>` | `index.ts,index.tsx,icons.ts` |
| `--ignore-dirs <liste>` | `__tests__` |
| `--allowlist <datei>` | keine; JSON `{"files": ["molecules/Foo.tsx"]}`, Pfade relativ zu `--src`. Einträge, die inzwischen eine Story haben oder gelöscht sind, schlagen fehl. |

## API-Konventionen

Verbindlich für alle Komponenten.

**`size` — eine Control-Skala.** Button, IconButton, Select, Chip, DatePicker, SearchInput, SegmentedControl und ItemActionsMenu nutzen dieselben Stufen (je Komponente eine Teilmenge):

| size | Höhe | Text | Icon | typischer Ort |
| --- | --- | --- | --- | --- |
| `xs` | 26 px | `caption` | 12 px | Filterleisten (Pills, Suche, Chips) |
| `sm` | 32 px | `body-sm` | 14 px | Property-Bars in Dialogen, IconButtons |
| `md` | 36 px | `body` | 16 px | Page-Toolbars, Header-Aktionen (Button-Default) |
| `lg` | 40 px | `body` | 16 px | Formularfelder |

Eigene Skalen haben nur Anzeige-Elemente: `Icon` (`xs`–`lg`, 12–20 px), `Avatar` (`xs`–`2xl`, 20–80 px), `DetailDialogWrapper` (Dialog-Breiten). `Badge` hat keine Größe, nur `compact`.

**`tone` — semantische Farbe:** `neutral | primary | success | warning | info | destructive`, jeweils auf das gleichnamige Token gemappt (`neutral` auf Secondary/Muted). **`variant` — nur die Form**, nie die Farbe: Button `solid | outline | ghost | link`, IconButton `quiet | ghost`, Badge `solid | soft | outline | plain`, Select `field | pill`, EmptyState `plain | dashed`, InfoBanner `muted | subtle`.

**Weitere Regeln:**

- **Werte:** Controls sind `value` + `onChange(next)`; nur das Compound `Select.Root` behält Radix' `onValueChange`.
- **Icons:** Eine Prop `icon` ist immer eine Komponenten-Referenz (`IconComponent`, z. B. `icon={Inbox}`), die Größe setzt das DS. Beliebige Visuals (Dots, Glyphen, Avatare) gehen als `ReactNode` in `leading`/`trailing`.
- **Zustände:** `busy` an Button/IconButton (Spinner, keine Disabled-Optik), `compactBelow` an Select-Pill und Chip (Label unterhalb des Breakpoints ausgeblendet).
- **`className`** hat jede Komponente — als Escape-Hatch für Layout, nicht als Styling-Mechanismus. Einzige legitime Farb-Nutzung: produkteigene Tints auf `Badge variant="outline"`.
- **Test-IDs:** Das DS verdrahtet keine `data-testid`; `data-*`/`aria-*` werden aufs primäre Element durchgereicht, interne Teile tragen `data-slot`.
- **Texte:** nie hart kodiert — englische Defaults als `<Komponente>Labels`, aufgelöst über `useLabels`, überschreibbar per `labels`-Prop; deutsche Fassung in `src/i18n/de/`.
- **Slots und Routing:** `children` = primärer Inhalt; benannte Slots (`leading`, `meta`, `header`/`footer`) für Zusatz-Regionen. Framework-Kopplung nie hart im Package — Pfad als Prop (`currentPath`), Links als `linkComponent`.
- **Story-Pflicht:** jede Komponente in `atoms/`/`molecules/`/`organisms/` hat eine sibling `.stories.tsx` (`make check-stories`).

**Listen-Seiten** (Seitenaufbau, den Apps einheitlich halten):

- `PageHeader` steht immer im `PageContainer` — sonst fehlt ihm das Seiten-Padding. Die primäre Anlegen-Aktion („Neu …") sitzt im `PageHeader`, nicht in der Filterleiste.
- `FilterBar` in dieser Reihenfolge: links Filter und Sortierung als `Select variant="pill"`, an/aus-Filter als `Chip`, Ansichts-Umschalter (Liste/Wolke, Board/Liste) als `SegmentedControl size="xs"`; rechts (`ml-auto`) die Suche als `SearchInput size="xs"`, danach sekundäre Aktionen als `Button variant="ghost" size="xs"`.
- Sortierung ist nie ein `SegmentedControl` — Optionen einer Sortierung sind Werte, keine Ansichten. Die Option benennt die Sortierung selbst („Nach Häufigkeit", „Alphabetisch").

## ESLint-Regeln für Apps

`@meimberg/ui/eslint` liefert die Regeln, die korrekte DS-Nutzung erzwingen — als ESLint-Core-Regeln (`no-restricted-imports`, `no-restricted-syntax`), ohne Plugin und ohne Build-Step.

| Export | Inhalt |
| --- | --- |
| `restrictedImportPaths` | Einträge für `no-restricted-imports` → `paths`: `lucide-react` (→ `@meimberg/ui/atoms/icons` + `Icon`), `@radix-ui/react-dialog` (→ `FormDialog`, `ui/dialog`, `ui/alert-dialog`), `@meimberg/ui/ui/avatar` (→ `Avatar`), `@meimberg/ui/ui/calendar` und `react-day-picker` (→ `DatePicker`), `@meimberg/ui/ui/sonner` (→ `Toaster`/`toast` aus dem Root-Barrel). |
| `restrictedImportPatterns` | Einträge für `patterns`: pfadbasierte `KpiTile`-Importe (→ Root-Barrel), sonstige `@radix-ui/*` (→ `@meimberg/ui/ui/*`). |
| `restrictedSyntax` | Selektoren für `no-restricted-syntax`: rohes `<input>`/`<textarea>`/`<select>` (→ `TextField`, `Select`, `Combobox`), `<h1 className="heading-1">` (→ `PageHeader`), `max-w-[1440px]` (→ `PageContainer`), Inline-Card-Frame `bg-card border rounded-lg shadow-card` (→ `Card`/`DashboardCard`), `hover-lift` (→ `Card interactive`), `setTheme(...)` (→ `ThemeToggle`). |
| `recommended` (auch Default-Export) | Fertiges Flat-Config-Array für `**/*.{ts,tsx}` aus allen drei Listen. |

Einfache App (Parser kommt aus `eslint-config-next`), vollständig in `examples/next-starter/eslint.config.mjs`:

```js
import {recommended as meimbergUi} from '@meimberg/ui/eslint'

export default defineConfig([...nextVitals, ...nextTs, ...meimbergUi])
```

**Eigene Restriktionen:** Flat Config merged Rule-Optionen nicht — ein späterer Block, der `no-restricted-imports` oder `no-restricted-syntax` für dieselben Dateien setzt, ersetzt die frühere Einstellung. Apps mit eigenen Listen nutzen deshalb nicht `recommended`, sondern spreaden die Bausteine in **jeden** Block, der diese Regeln setzt:

```js
'no-restricted-imports': ['error', {
  paths: [...restrictedImportPaths, ...appPaths],
  patterns: [...restrictedImportPatterns, ...appPatterns],
}],
'no-restricted-syntax': ['error', ...restrictedSyntax, ...appSelectors],
```

**Ausnahmen:** nur inline mit Begründung, z. B. `// eslint-disable-next-line no-restricted-syntax -- native file input, kein DS-Pendant`. Keine Datei-Whitelists für DS-Regeln in der App; fehlt dem DS etwas, gehört die Erweiterung ins DS.

## Komponenten-Inventar

Source of Truth pro Komponente ist **Storybook** — veröffentlicht unter https://meimberg-io.github.io/io.meimberg.ui/ (Stand des letzten Release-Tags), lokal mit `make storybook` (http://localhost:6007) — Varianten, States, Props live. Foundations (Colors/Spacing/Typography/Radius/Responsive) dokumentieren `@meimberg/ui/tokens` app-agnostisch. Alle Entwicklungs-Befehle (Checks, Changeset, Release): `make help`.

## Vendor-Kuration (`ui/`)

`ui/` enthält nur die **real genutzten** shadcn-/Radix-Primitives. Wird ein weiteres gebraucht, aus Upstream nach `src/ui/` kopieren und an die Tokens anpassen — die `./ui/*`-Export-Map nimmt es automatisch auf.

### Vendor-Änderungen

Abweichungen von Upstream, damit Updates aus shadcn nachvollziehbar bleiben:

- Alle Primitives: Typografie-Rollen (`body`/`body-sm`/`caption`) statt Tailwind-Textgrößen, Tap-Target `pointer-coarse:min-h-tap`, Close-/Aktions-Icons aus `atoms/icons`, Screenreader-Texte über `useLabels`.
- `card`: `interactive` (Hover-Akzent + Pointer).
- `alert-dialog`: `AlertDialogAction` nimmt `variant`/`tone`/`size` des Buttons.
- `dialog`: Bottom-Sheet auf Mobile (`disableMobileSheet` schaltet es ab).
- `popover`: exportiert `PopoverAnchor`.
- `slider`: `tone`.
- `sidebar`: Trigger als `IconButton`.

## Provider-Contract

Details siehe `src/providers.tsx`. Kurz: `UiProviders` = next-themes `ThemeProvider` + Radix `TooltipProvider` + Sprach-Context (`UiI18nProvider`); den `Toaster` setzt die App hinein, alles andere (QueryClient, Auth) mountet sie selbst.

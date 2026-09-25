# @meimberg/ui

Produktneutrales Design-System (Komponenten) auf Basis von `@meimberg/ui/tokens`
(Foundations). Aus der Pulse-App extrahiert (PUL-462/464), damit weitere Apps
dasselbe Look-and-Feel — inklusive App-Gerüst — ohne Copy-Paste konsumieren
können. Wird von der App via Next `transpilePackages` aus der Quelle gebaut
(kein separater Build-Step).

**Domain-frei:** kein Import aus einem App-Baum (`@/*`), keine Fachlichkeit —
erzwungen per `eslint.config.mjs` + `tsc`. Produktspezifische Semantik (bei
Pulse: Prio/Stage/Vocab-Farb-Tokens, Auth, Queries) bleibt in der jeweiligen
App.

## Struktur

Volle Atomic-Design-Dreiteilung (nach **Komposition**, nicht nach Feature-Topf):

- `src/ui/` — shadcn-Vendor-Primitives (as-is portiert, kuratiert — siehe unten).
- `src/atoms/` — **ein Element**: Controls (`TextField`, `SelectField`,
  `RichSelect`, `DatePicker`, `SegmentedSwitch`, `Dropdown`, `ThemeToggle`,
  `SearchInput`, …) + Anzeige (`Icon`, `Pill`, `Chip`, `IconBadge`, `Avatar`,
  `Sparkline`, …) + Layout-Primitives (`PageContainer`, `ScrollableContent`)
  + `atoms/icons` (Lucide-Re-Export).
- `src/molecules/` — **Kompositionen aus 2+ Elementen** (`FormField`/`FormRow`/
  `FormSection`, `KpiTile`, `EmptyState`, `SectionCardHeader`, `TileGrid`,
  `PageHeader`, …).
- `src/organisms/` — **App-Gerüst + große Kompositionen/Modals** (`AppShell`,
  `AppSidebar`, `Breadcrumbs`, `UserMenu`, `SubNavLayout`, `FilterBar`,
  `FormDialog`, `DataTable`, `IconUploadCropDialog`, `markdown-editor`, …).

## Import-Pfade

| Import | Inhalt |
| --- | --- |
| `@meimberg/ui` | Root-Barrel: **alles** (atoms/molecules/organisms) + `cn`/`useIsMobile` + `UiProviders` + `Toaster`/`toast`. Auch das Form-System läuft hierüber (kein `/form`-Subpath). |
| `@meimberg/ui/atoms/icons` | Lucide-Icons (separates Barrel wegen Namens-Kollisionen `Pill`/`Tag`/`Donut`). |
| `@meimberg/ui/ui/*` | Einzelne shadcn-Primitives (`button`, `dialog`, …). |
| `@meimberg/ui/organisms/markdown-editor` \| `@meimberg/ui/molecules/markdown-renderer` | Schwere Bundles (TipTap / react-markdown) — bewusst nur per Subpath, nicht im Root-Barrel. |
| `@meimberg/ui/providers` | Provider-Contract (`UiProviders`). |
| `@meimberg/ui/tokens` | Foundations/Preset (Tailwind-v4-Tokens, Custom-Variants, Base-Resets) — als CSS `@import`. |
| `@meimberg/ui/styles.css` | DS-Stylesheet (Tailwind v4 + `@meimberg/ui/tokens` + Radix-Animationen). |

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

Die Tokens sind HSL-Kanäle ohne `hsl()` (`--primary: 262 70% 50%`). Eine App überschreibt sie nach dem Tokens-Import. Die Markenfarbe steckt in `--primary`, `--ring`, `--sidebar-primary` und `--sidebar-ring`, jeweils in `:root` und `.dark`:

```css
/* app/brand.css */
:root { --primary: 262 70% 50%; --ring: 262 70% 50%; --sidebar-primary: 262 70% 50%; --sidebar-ring: 262 70% 50%; }
.dark { --primary: 262 80% 68%; --ring: 262 80% 68%; --sidebar-primary: 262 80% 68%; --sidebar-ring: 262 80% 68%; }
```

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
    <UiProviders theme={{ defaultTheme: 'system', enableSystem: true }}>
      {children}
      <Toaster />
    </UiProviders>
  )
}
```

`UiProviders` bündelt die Contexts, die das DS voraussetzt: next-themes `ThemeProvider` (Dark Mode über die Klasse `.dark`) und Radix `TooltipProvider`. Der `Toaster` muss innerhalb sitzen, sonst folgt er dem Theme nicht. `ThemeToggle` bietet Hell/Dunkel/System an und braucht dafür `enableSystem: true`.

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
          header={collapsed => <span className="heading-3">{collapsed ? 'A' : 'App'}</span>}
          footer={collapsed => <UserMenu name="Ada Lovelace" email="ada@example.com" collapsed={collapsed} linkComponent={Link} />}
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

Sekundär-Navigation (Settings-Stil): `<SubNavLayout items currentPath linkComponent onNavigate>`. Fehlerseite: `app/error.tsx` rendert `<RouteErrorState error reset />`.

### 7. Toast

Den `<Toaster />` einmal in den Providern mounten (Schritt 5). Toasts auslösen:

```tsx
import { toast } from '@meimberg/ui'
toast.success('Gespeichert')
```

## API-Konventionen

Verbindlich für **neue** Komponenten (Bestehendes migriert nur bei Bedarf):

- **Größen:** `sm` / `md` / `lg`. Dokumentierte Ausnahmen: `Avatar` (`xs`–`xl` —
  eigenständige Avatar-Skala), `Dropdown` (`sm`/`md`/`chip` — `chip` ist der
  Filter-Pill-Kontext), sowie die shadcn-Erblasten `Button`/`IconButton`
  (`default` statt `md`). ⚠ **Watch:** eine vollständige Size-Token-
  Vereinheitlichung über alle Controls ist ein bewusst separater, API-breaking
  Refactor (App-weiter Call-Site-Churn) — nicht Teil von PUL-464.
- **Farbe/Zustand:** semantische `variant`/`tone`-Props, **nicht** per-Call-Site-
  `className`. `className` bleibt reiner Escape-Hatch (Layout-Klassen), kein
  Styling-Mechanismus.
- **Slots:** `children` = primärer Inhalt/Label; benannte `xSlot`/`render*`-Props
  für Zusatz-Regionen (z. B. `leading` an `IconBadge`, `header`/`footer` an
  `AppSidebar`). Framework-Kopplung (Routing) NIE hart im Package — Pfad als
  Prop (`currentPath`), Links als `linkComponent`-Slot.
- **Story-Pflicht:** jede Komponente in `atoms/`/`molecules/`/`organisms/` hat
  eine sibling `.stories.tsx` (Drift-Schutz `pnpm check:stories`).

## Komponenten-Inventar

Source of Truth pro Komponente ist **Storybook** (`make storybook`, http://localhost:6007) — Varianten, States, Props live. Foundations (Colors/Spacing/Typography/Radius/Responsive) dokumentieren `@meimberg/ui/tokens` app-agnostisch. Alle Entwicklungs-Befehle (Checks, Changeset, Release): `make help`.

## Vendor-Kuration (`ui/`)

`ui/` enthält nur die **real genutzten** shadcn-Primitives. Ungenutzte wurden
entfernt (PUL-464 S4). Wird ein weiteres shadcn-Primitive gebraucht, per
`shadcn`-CLI (bzw. Copy aus Upstream) nach `src/ui/` hinzufügen — die
`./ui/*`-Export-Map nimmt es automatisch auf.

## Provider-Contract

Details siehe `src/providers.tsx`. Kurz: `UiProviders` = next-themes
`ThemeProvider` + Radix `TooltipProvider`; alles andere (QueryClient, Toaster,
Auth) mountet die App selbst.

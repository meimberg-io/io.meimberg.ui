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

### 1. Dependency + Transpile

Das Package wird als **Quelle** konsumiert (kein Build-Step), die App transpiliert
es via Next `transpilePackages`:

```ts
// next.config.ts
const nextConfig = { transpilePackages: ['@meimberg/ui'] }
```

`package.json` der App — je nach Setup:

```jsonc
// externe App: git-Dependency, gepinnt auf einen Release-Tag
"@meimberg/ui": "github:meimberg-io/io.meimberg.ui#v0.1.0"

// oder im selben pnpm-Monorepo als Workspace-Member
"@meimberg/ui": "workspace:*"
```

`@meimberg/ui/tokens` ist ein Subpath **desselben** Packages — keine separate
Dependency, kein eigener transpile-Eintrag.

### 2. Stylesheet (Tailwind v4)

Die `globals.css` der App importiert Tailwind, das Tokens-Preset und die
Animationen — in dieser Reihenfolge:

```css
@import "tailwindcss";
@import "@meimberg/ui/tokens";   /* Foundations: Farben, Surfaces, Typografie, pill/hover-card/skeleton, Form-@utilities */
@import "tw-animate-css";
```

`@meimberg/ui/tokens` liefert **neutrale** Foundations. Produktspezifische
semantische Farb-Tokens (bei Pulse z. B. `--p1..p4`, `--signal`/`--sprout`,
`--vocab-*`) gehören **nicht** ins Package — die neue App definiert ihre eigenen
`:root`/`.dark` + `@theme inline`-Mappings in einer eigenen CSS-Datei (Muster:
`app/src/app/domain-tokens.css`).

### 3. Root-Layout + Font + Provider

```tsx
// app/layout.tsx
import { Inter } from 'next/font/local'   // oder next/font/google
import { Providers } from './providers'
import '@meimberg/ui/styles.css'          // oder die app-eigene globals.css, die das Preset importiert

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
// app/providers.tsx  ('use client')
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UiProviders, Toaster } from '@meimberg/ui'
import { useState, type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={qc}>
      <UiProviders>{children}</UiProviders>   {/* Theme + Tooltip — der Provider-Contract */}
      <Toaster />
    </QueryClientProvider>
  )
}
```

`UiProviders` bündelt die von `@meimberg/ui` vorausgesetzten Contexts
(next-themes `ThemeProvider` + Radix `TooltipProvider`). Consumer mit eigenem
Stack können die beiden auch direkt setzen — das ist der dokumentierte Contract.
`QueryClient` ist App-Sache (nicht im Package).

### 4. App-Gerüst (Navigation)

Die komplette Shell ist config-getrieben und framework-agnostisch (Pfad als
Prop, Links über `linkComponent`-Slot):

```tsx
import { AppShell, AppSidebar, Breadcrumbs, UserMenu, type SidebarNavGroup } from '@meimberg/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, Inbox } from '@meimberg/ui/atoms/icons'

const groups: SidebarNavGroup[] = [{
  label: 'Navigation',
  items: [
    { label: 'Home', href: '/', icon: <House className="h-4 w-4" /> },
    { label: 'Inbox', href: '/inbox', icon: <Inbox className="h-4 w-4" /> },
  ],
}]

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  return (
    <AppShell
      sidebar={
        <AppSidebar
          groups={groups}
          currentPath={path}
          linkComponent={Link}
          header={collapsed => (collapsed ? <Logo mark /> : <Logo full />)}
          footer={collapsed => <UserMenu name="…" email="…" collapsed={collapsed} linkComponent={Link} footer={<SignOutForm />} />}
        />
      }
      headerStart={<Breadcrumbs rootLabel="App" items={crumbs} linkComponent={Link} className="hidden md:block" />}
      headerEnd={<ThemeToggle />}
    >
      {children}
    </AppShell>
  )
}
```

Sekundär-Navigation (Settings-Stil): `<SubNavLayout items currentPath linkComponent onNavigate>`.
Filter-Leisten: `<FilterBar fields value onChange>` (`custom`-Feld für app-eigene Controls).

### 5. Toast

`<Toaster />` einmal am Root mounten (siehe Providers). Toasts auslösen mit
`toast()` — aus `@meimberg/ui` (re-exportiert) oder direkt aus `sonner`:

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

Source of Truth pro Komponente ist **Storybook** (`pnpm --filter @meimberg/ui
storybook`) — Varianten, States, Props live. Foundations (Colors/Spacing/
Typography/Radius) dokumentieren `@meimberg/ui/tokens` app-agnostisch.

## Vendor-Kuration (`ui/`)

`ui/` enthält nur die **real genutzten** shadcn-Primitives. Ungenutzte wurden
entfernt (PUL-464 S4). Wird ein weiteres shadcn-Primitive gebraucht, per
`shadcn`-CLI (bzw. Copy aus Upstream) nach `src/ui/` hinzufügen — die
`./ui/*`-Export-Map nimmt es automatisch auf.

## Provider-Contract

Details siehe `src/providers.tsx`. Kurz: `UiProviders` = next-themes
`ThemeProvider` + Radix `TooltipProvider`; alles andere (QueryClient, Toaster,
Auth) mountet die App selbst.

---
"@meimberg/ui": major
---

Seiten-Komposition: Apps können das Seiten-Skelett nicht mehr falsch zusammensetzen.

**`FilterBar` mit festen Slots (breaking).** Freie `children` entfallen. Neue Props `filters` (links: Select-Pills, Chips), `view` (Ansichts-Umschalter, `SegmentedControl size="xs"`), `search` (Beginn der rechtsbündigen Gruppe, `ml-auto`) und `actions` (rechts nach der Suche: sekundäre Aktionen). Die Reihenfolge filters → view → [search → actions] legt die Komponente fest; jede Gruppe trägt `data-slot` (`filters`, `view`, `end`, `search`, `actions`). `tint`, `below`, `contentClassName` und HTML-Attribute bleiben. Unter `md` bricht alles um, die Suche nimmt die volle Breite.

**Migration `FilterBar`:**

- Select-Pills und Chips aus `children` → `filters={<>…</>}`.
- `SegmentedControl size="xs"` (Ansicht) → `view`.
- `SearchInput size="xs"` → `search`; eigene Positionsklassen (`md:ml-auto`, `lg:ml-auto`, `lg:w-[200px]`) entfallen, die Gruppe ist rechtsbündig.
- Sekundäre Buttons nach der Suche → `actions`.
- Die primäre Anlegen-Aktion gehört nicht in die Leiste, sondern in `Page`/`ListPage` `actions` (Header).

**Neu: `Page`** (Organism) — `PageContainer` > `PageHeader` > `children`. Props `title`, `description`, `leading`, `meta`, `actions` (Header-Action-Bereich), `contained` (Default `true`; `false`, wenn ein Layout den Container stellt), `className` und HTML-Attribute.

**Neu: `ListPage`** (Organism) — alles aus `Page`, dazu `intro` (zwischen Header und Filterleiste), `filters`, `view`, `search`, `filterActions`, `filterTint`, `filterBelow` (an die `FilterBar`; die Leiste erscheint nur mit mindestens einem der vier Slots) und `children` (Liste).

**Migration Seiten:** `<PageContainer><PageHeader title … onAction …>{buttons}</PageHeader>…</PageContainer>` → `<Page title … actions={…}>…</Page>`; mit Filterleiste → `<ListPage … filters search …>`. `actionLabel`/`onAction` des `PageHeader` → `actions={<Button icon={AddIcon} onClick={…}>…</Button>}`.

**`PageHeader`:** der Action-Bereich trägt `data-slot="actions"`.

**Neu in `@meimberg/ui/eslint`:** `pageCompositionPaths` (Einträge für `no-restricted-imports` → `paths`, sperren `PageHeader` und `PageContainer` aus `@meimberg/ui` per `importNames`) und `pageComposition(files, {ignores?})` (Flat-Config-Block inkl. der Basis-Listen, nach `recommended` einhängen). Opt-in für die Routen-Dateien der App; Hero-Komponenten, die bewusst einen `PageHeader` in einem bestehenden Container rendern, über `ignores` ausnehmen. `FilterBar` bleibt erlaubt. Die Meldungen der `heading-1`- und `max-w-[1440px]`-Selektoren verweisen jetzt auf `Page`/`ListPage`. Der Next-Starter nutzt `Page` und `pageComposition`.

# Konsolidierung `@meimberg/ui` — Bestandsaufnahme und Plan

Stand: 2026-09-25, Basis v1.2.5. Arbeitsdokument: wird gelöscht, wenn der Plan umgesetzt ist.

Ziel: Mit `@meimberg/ui` lassen sich weitere Apps bauen, ohne dass man Pulse kennen muss.

## Fazit

Konsolidierung ist nötig, aber kein Neubau. Der Kern ist gesund: keine Pulse-Imports, Routing über `currentPath`/`linkComponent`, keine `next/*`-Imports, jede Komponente hat eine Story, `make check` grün (217 Tests). Für eine zweite App ist die Library trotzdem nicht einbaubar: Nach README-Setup rendert sie ungestylt, das Dependency-Modell kann doppelte Kontext-Instanzen erzeugen, es gibt keine CI, und die UI-Texte sind hart deutsch. Dazu kommen Dubletten und uneinheitliche APIs aus der Extraktion.

## Bestandsaufnahme

### Umfang

- 27 Atoms, 15 Molecules, 12 Organisms, 37 Dateien in `ui/` (davon 8 Eigenbau, kein shadcn-Vendor).
- Pulse importiert in 176 Dateien aus dem DS. Am häufigsten: `Button`, `PageContainer`, `EmptyState`, `PageHeader`, `FormDialog`, `FormSection`, `SelectField`, `FormField`, `TextField`.
- Von Pulse nie genutzt: `FilterBar`, `SearchInput`, Atom `ComingSoon`, `UiProviders`, Root-`Toaster`/`toast`, `ui/toast` + `hooks/use-toast` (auch DS-intern tot).
- Pulse ist auf Next 16.1.6, nicht 15. Andere Versionen sind ungetestet.

### A — Einbau in eine neue App (Blocker)

- **`@source` fehlt.** Tailwind v4 scannt `node_modules` nicht. `src/tokens/theme.css` hat kein `@source`, das README erwähnt es nicht. Pulse umgeht das mit `@source "../../../node_modules/@meimberg/ui/src"` (`pulse/app/src/app/globals.css:29`), was am Hoisting hängt und schon einmal still kaputtging.
- **Versteckte Abhängigkeiten.** `@tailwindcss/typography` (MarkdownRenderer/-Editor nutzen `prose`), `tw-animate-css` und `tailwindcss` sind weder dependency noch peer.
- **Peer-Modell falsch.** Nur `react`/`react-dom` sind Peers. `next-themes` und `sonner` sind normale dependencies, obwohl sie Kontext bzw. Singleton sind; bei abweichender Version in der App wirken Theme-Toggle oder `toast()` nicht. README und `index.ts` nennen sonner „Peer". TipTap, react-markdown und react-easy-crop werden immer installiert.
- **README-Setup fehlerhaft.** Tag `#v0.1.0`, `workspace:*`-Hinweis, falscher `next/font`-Import, undefiniertes `inter`, Pflicht-Variable `--font-inter` nicht erwähnt, `Toaster` außerhalb `UiProviders` (folgt dann dem Theme nicht), Schritt 4 nicht lauffähig (fehlende Imports, `'use client'`).
- **Keine CI**, kein veröffentlichtes Storybook. Tags entstehen ungeprüft.
- **Kein zweiter Konsument.** Pulse nutzt weder `UiProviders` noch den README-Weg; der Provider-Vertrag ist unerprobt.

### B — Pulse-Reste und fehlende Neutralität

- **Hart kodierte UI-Texte**, gemischt DE/EN, ohne Label- oder Locale-Mechanismus: u. a. DatePicker, KpiTile („vs. letzte Woche"), FilterBar, FormDialog, RichSelect, SearchInput, EditableInlineHeading, RouteErrorState, form-actions, markdown-editor (mit `window.prompt`).
- **Bug:** DatePicker ignoriert die `locale`-Prop im Trigger-Label (`lib/datetime.ts:13,19` fest `de-DE`).
- **Fachlichkeit im Code:** `/api/attachments/`-Whitelist (`molecules/markdown-renderer.tsx:60`), Dashlet-Konzept in ComingSoon, WeightDots (Missions-Gewicht 1–5), KpiTile fest auf Wochenvergleich, `defaultTheme: 'dark'` in `providers.tsx`.
- **Theme nicht neutral:** Primary ist Pulse-Cyan, `--info` = Primary, Kopf „Pulse Design-System Foundations".
- **Altlasten:** 129 PUL-Referenzen und 56 „Pulse"-Nennungen in Kommentaren, tote Doc-Pfade, Stories mit Pulse-Fachtexten (Mission, Bucket, Signal …).

### C — Theming

- Nur HSL-Kanal-Tokens (shadcn-v3-Stil), undokumentiert, welche Variablen man für eine Marke überschreibt (Primary steckt in `--primary`, `--ring`, `--info`, `--sidebar-primary`, `--sidebar-ring`).
- Radius und Typo teilweise fest: `field-shell` 8 px, `form-dialog-shell` 14 px, `.heading-*`/`.body*` in px, 21 Arbitrary Values in Komponenten.
- Typo-Rollen, `.pill`, `.hover-card` sind plain Klassen statt `@utility` → keine Varianten (`max-sm:body-sm`), tailwind-merge kennt sie nicht; Pulse braucht dafür `!`-Overrides.
- Dark Mode nur über `.dark`, `UiProviders` bietet aber `attribute: 'data-theme'` an (bricht still).
- Fehlende Tokens `--warning-foreground`, `--info-foreground`.
- Muster „Produkt-Tokens ergänzen" (Pulse `domain-tokens.css`, inkl. `@theme`-Merge-Stolperstein) nicht dokumentiert.

### D — Dubletten und Layer

- **Selects ×3:** `Dropdown`, `SelectField`, `RichSelect` (RichSelect ohne Tastatur-Navigation, doppelte `listboxId` ohne testId).
- **Pills/Badges ×7:** `Pill`, `CounterPill`, `MetaPill`, `Chip`, `FilterChip`, `IconBadge`, `ui/badge`; MetaPill ≈ IconBadge-chip.
- **Weitere Paare:** `SegControl`/`SegmentedSwitch`, `ComingSoon` atom/ui, `Avatar` atom/ui, `ui/field`/`FormField`, 4 Dialog-Varianten, eigener `SubmitButton` in FormDialog, 5 Icon-Helfer mit widersprüchlichen Icon-Prop-Typen, Namenskollision `LucideIcon` (Typ vs. Komponente).
- **`ui/` enthält Eigenbau** (action-icons, card-actions, coming-soon, field, form-actions, icon-button, icon-picker, lucide-icon) ohne Stories und Layer-Regeln; Vendor-Änderungen an shadcn undokumentiert, kein `components.json`.
- **Toter Code:** `ui/toast.tsx`, `hooks/use-toast.ts`, `@radix-ui/react-toast`, `molecules/DemoForm.spike.test.tsx`.
- **Interna öffentlich:** `DROPDOWN_SIZE`, `DROPDOWN_ALL_VALUE`, `usePopoverPosition`, `formatAbsoluteDate`.

### E — API-Konsistenz

- `size`-Vokabular uneinheitlich (`sm|md`, `default|sm`, `default|compact` …); „sm" = 26 px oder 32 px.
- `tone`/`variant` uneinheitlich (`warn` vs. Token `warning`, `danger` vs. `destructive`, `primary` vs. Button `default`).
- `className` fehlt bei ~14 Komponenten; hart verdrahtete `data-testid`; nur controlled, Callback-Namen gemischt (`onChange`/`onValueChange`/`onSelect(item)`).
- Tests fehlen bei 13 Komponenten, kritisch: Dropdown, AppSidebar, DataTable.

### F — Was noch in Pulse liegt und ins DS gehört

- `atoms/FilterBarShell` + `atoms/FilterSearch` sind Pulses echte Filter-Lösung (18 Dateien); die DS-`FilterBar` ist ungenutzt.
- `hover-reveal` (`@utility` in Pulse-`globals.css`); DS-`ui/card-actions.tsx:64` hat genau den iPad-Bug, den `hover-reveal` behebt.
- API-Lücken, die Pulse per Override umgeht: Badge-Töne success/warning (13×), Card `interactive` (4×), 26-px-Button-Größe, IconButton `primary` + `busy` (ersetzt SyncButton/SyncIconButton), `leading`-Slot an PageHeader (3 Allowlist-Fälle), `closeMobile` im AppSidebar-Footer, Action-Items im UserMenu, `compactBelow` an Chip (ersetzt PillToggle).
- Breadcrumb-Titel-Context und Pfad→Crumbs-Ableitung (`pulse/app/src/components/layout/`).
- DS-Nutzungsregeln stecken in `pulse/app/eslint.config.mjs` (lucide nur über `atoms/icons`, kein rohes `<input>`, `PageContainer` statt `max-w-[1440px]`, …) — App #2 bekäme sie nicht.
- Doppeltes Tooling: Story-Coverage-Check, jsdom-Setup, Test-Render-Wrapper, Storybook-Preview.

## Plan

Die Phasen bauen aufeinander auf. Phase 1 ist klein und nicht-brechend; ab Phase 2 fallen Breaking Changes an, die gesammelt als **v2.0.0** erscheinen sollen, statt verstreut als Minor/Patch.

### Phase 1 — Einbaubar machen (v1.3, nicht brechend)

**Erledigt mit v1.3.0 (2026-09-25).** Pulse ist auf v1.3.0 umgestellt, CI grün.

1. `@source "../";` in `src/tokens/theme.css`; Pulse-Hack danach entfernen.
2. Peers: `next-themes`, `sonner`, `tailwindcss@^4`, `tw-animate-css`; optional-Peers: `@tailwindcss/typography`, TipTap-Set, `react-markdown`-Set, `react-easy-crop`. `engines`-Feld.
3. README-Setup korrigieren (Tag, Fonts, Provider/Toaster, lauffähiges Shell-Beispiel, Tailwind-Plugins).
4. Pulse auf `UiProviders` und Root-`Toaster` umstellen (erster echter Konsument des Vertrags).
5. CI (GitHub Actions): `make check` auf Push und Tag.
6. `examples/next-starter/` im DS-Repo, in CI gebaut: Integrationstest für jeden Tag und Vorlage für App #2.
7. Spike-Test löschen, `card-actions`-iPad-Bug fixen, `hover-reveal` ins DS ziehen. `ui/toast` + `use-toast` sind über den Subpath `ui/*` öffentlich — ihr Löschen ist ein Bruch und wandert nach v2.0 (Phase 3).

### Phase 2 — Neutral und themebar (v2.0)

**Erledigt als Vorab-Version v2.0.0-next.1 (2026-09-25).** Pulse pinnt die Vorab-Version; v2.0.0 final nach Phase 3. Abweichungen vom Plan: Die Attachment-Sonderregel im MarkdownRenderer war wirkungslos (relative URLs waren ohnehin erlaubt) und ist ersatzlos entfallen, eine `allowedUrlPrefixes`-Prop war nicht nötig. WeightDots bleibt generisch (`max`) im DS.

1. Label-Mechanismus: jede Komponente mit UI-Text bekommt `labels`-Props mit englischem Default, zusätzlich ein `UiProviders`-weites `locale` + Messages-Objekt; deutsche Messages als mitgelieferter Export für Pulse.
2. DatePicker-Locale-Bug, KpiTile-Vergleichstext als Prop, `window.prompt` im Editor ersetzen.
3. Fachlichkeit raus: Attachment-Whitelist als Prop (`allowedUrlPrefixes`), ComingSoon ohne Dashlet, WeightDots generisch (`max`) oder zurück nach Pulse, `defaultTheme: 'system'`.
4. Neutrales Default-Theme; Pulse-Cyan wandert als Marken-Override nach Pulse.
5. Typo-Rollen, `.pill`, `.hover-card` als `@utility`; Radius/Typo an Tokens; fehlende Foreground-Tokens; `data-theme` entfernen.
6. Theming-Doku „Eigene Marke" und „Produkt-Tokens ergänzen"; Storybook mit zweitem Beispiel-Theme.
7. Kommentar- und Story-Altlasten bereinigen (PUL-Referenzen, Pulse-Texte).

### Phase 3 — Konsolidieren (v2.0)

**Erledigt mit v2.0.0 (2026-09-25).** Entwurf und Entscheidungen standen in `docs/phase-3-entwurf.md` (mit dem Release gelöscht; API-Konventionen jetzt im README, alle Zuordnungen alt → neu im CHANGELOG). Pulse ist vollständig migriert. Offen für später: ein gefüllter quadratischer Icon-Button (Pulse-CaptureTrigger ist dafür 4 px breiter), `Select.TriggerIcon` ohne Zugriff auf die Pixelgröße für Kinder mit numerischer Größe (Pulse-ContextDropdown spiegelt die Tabelle), `EditableInlineHeading.size` nutzt noch die Typo-Skala.

1. Selects zusammenführen: ein `Select` (einfach) + ein `Combobox` (Suche/Rich-Items, Tastatur-Navigation); `Dropdown` als Filter-Variante davon.
2. Pills/Badges auf zwei Konzepte reduzieren: `Badge` (passiv, mit Tönen) und `Chip` (interaktiv, toggle/removable).
3. Dubletten auflösen: SegControl/SegmentedSwitch, ComingSoon, Avatar, `ui/field`, SubmitButton, Icon-Helfer (ein Icon-Prop-Typ); toten Radix-Toast (`ui/toast`, `hooks/use-toast`, `@radix-ui/react-toast`) löschen.
4. Eigenbau aus `ui/` in die Layer verschieben (mit Stories); `ui/` nur noch Vendor, Änderungen dokumentiert.
5. Einheitliches Vokabular für `size`/`tone`/`variant`, `className` überall, keine hart verdrahteten Test-IDs, Interna aus dem Public API.
6. Filter: Pulse-`FilterBarShell`/`FilterSearch` ins DS, DS-`FilterBar` darauf aufbauen oder streichen.
7. API-Lücken aus Pulse schließen (Liste in F) und die Pulse-Workarounds entfernen.
8. Tests für Dropdown, AppSidebar, DataTable und die übrigen 10.

### Phase 4 — Tooling teilen

1. ESLint-Config `@meimberg/ui/eslint` mit den DS-Nutzungsregeln; Pulse konsumiert sie, veraltete Pulse-Overrides und Meldungen raus.
2. Test-Setup (`vitest.setup`, `renderWithProviders`) und Story-Coverage-Check als Export; Pulse-Duplikate raus.
3. Storybook veröffentlichen (GitHub Pages).

## Entscheidungen (2026-09-25)

- **Sprache:** Englische Default-Labels, deutsches Messages-Paket als Export (Pulse nutzt es).
- **Stack für weitere Apps:** nur Next.js. Keine Vite-Variante, kein Build-Schritt nötig.
- **Verteilung:** Git-Tag bleibt, nur die Peers werden korrigiert. Kein Registry-Publish.
- **Versionierung:** Phase 1 als v1.3 ohne Bruch; Phasen 2 und 3 gesammelt als v2.0.0 mit Migrationshinweisen.

---
'@meimberg/ui': major
---

Neutral und anpassbar (Konsolidierung Phase 2).

**Sprache**
- Alle Komponenten-Texte sind englisch und über einen Label-Mechanismus überschreibbar: App-weit per `<UiProviders messages={…}>`, pro Instanz per `labels`-Prop. Label-Typen `<Komponente>Labels`, Gesamt-Typ `UiMessages`, Hooks `useLabels`/`useUiLocale`/`useDateLocale`.
- Deutsches Paket: `import {de} from '@meimberg/ui/i18n/de'` → `<UiProviders {...de}>` (Labels, `de-DE`, date-fns-Locale).
- **Migration:** Apps, die bisher die deutschen Defaults genutzt haben, übergeben `{...de}` an `UiProviders`.
- `formatAbsoluteDate(date, mode, locale)`: `locale` ist jetzt Pflicht.
- DatePicker: Kalender-Locale und Datumsformat kommen aus dem Provider (Default `en-US`/`enUS`); bisher war `de` fest, das Trigger-Label ignorierte die `locale`-Prop.

**Theme**
- Neutrale Default-Palette (Slate + blaues Primary), `--info` eigenständig. **Migration:** Eine App, die das bisherige Aussehen behalten will, überschreibt die Farb-Tokens nach dem Tokens-Import (siehe README § Eigene Marke).
- Neue Tokens `--warning-foreground`, `--info-foreground`; Typografie über `--type-<rolle>-size/-leading`; `rounded-xl/2xl`, Form-Felder und Dialoge leiten sich von `--radius` ab.
- `heading-*`, `body`, `body-sm`, `caption`, `pill`, `pill-hover`, `hover-card`, `skeleton-shimmer` sind `@utility` statt plain Klassen: Varianten wie `max-sm:body-sm` funktionieren jetzt.
- `UiProviders`: Default-Theme `system` mit `enableSystem`; die Option `attribute: 'data-theme'` entfällt (Dark Mode hängt an `.dark`).

**Produkt-Neutralität**
- `ComingSoon` (Atom): `label` → `title`, `dashlet`/`data-dashlet` entfallen.
- `ui/coming-soon`: `dashlet` entfällt, `title` optional.
- `WeightDots`: `value`/`onChange` als `number`, neue Prop `max` (Default 5), Typ `WeightValue` und fest verdrahtetes `data-testid` entfallen (dafür `data-testid`-Prop).
- `KpiTile`: Vergleichstext als Label `comparison` (Default „vs. previous period").
- `EmptyState`: Action-Button-`data-testid` `page-header-action` → `empty-state-action`.
- `MarkdownRenderer`: Sonderfall für eine Pulse-Route entfernt (relative URLs sind unverändert erlaubt).
- `MarkdownEditor`: `window.prompt` für Links/Bilder durch ein Inline-Popover ersetzt.
- `SubNavLayout`, `IconUploadCropDialog`: Text-Defaults kommen aus den Labels.
- Stories, Kommentare und Foundations ohne Pulse-Bezug; Storybook mit Sprach-Umschalter und Demo-Marke.

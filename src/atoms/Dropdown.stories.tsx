// Zwei Nutzungsformen des `Dropdown`:
//   1. Convenience `<Dropdown options={…} />` — einfache Text- oder
//      Inline-Icon-Listen (Status, Priorität, Typ). Trigger-Icon = Row-Icon.
//   2. Compound `<Dropdown.Root><Dropdown.Pill icon={…}><Dropdown.Content>
//      <Dropdown.Row>` — reiche Fälle mit border-flush Square-Icon im Trigger
//      (wie BucketDropdown) oder Avatar-Trigger (OrgSwitcher).
//
// Story-Aufbau: jede Story = EINE Layout-Variante, dargestellt in ALLEN drei
// Größen (sm/chip/md). Die Größe ist eine Quer-Dimension durch alle Samples,
// keine eigene Story — so sieht man jede Variante (auch Compound) in md.
import type {Meta, StoryObj} from '@storybook/react-vite'
import {useState, type ReactNode} from 'react'
import {Dropdown, DROPDOWN_SIZE, type DropdownSize} from './Dropdown'
import {ListTodo, Inbox, Folder, FileText, Archive, Tag, Star} from '../atoms/icons'

const meta: Meta<typeof Dropdown> = {
  title: 'Atoms/Dropdown',
  parameters: {
    docs: {
      description: {
        component:
          'Convenience `<Dropdown options>` für einfache Text-/Icon-Listen. ' +
          'Compound `<Dropdown.Root><Dropdown.Pill><Dropdown.Content><Dropdown.Row>` für reiche Fälle ' +
          'mit border-flush Square-Icon im Trigger (z. B. BucketDropdown-Stil) oder Avatar-Trigger. ' +
          'Jede Story zeigt die Variante in allen drei Größen (sm/chip/md).',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Dropdown>

// ─── Größen-Matrix-Helper ────────────────────────────────────────────────────
// Rendert eine Variante in sm / chip / md nebeneinander. `render` liefert je
// Größe eine eigenständige (stateful) Instanz — die Hooks leben in der
// jeweiligen Variant-Komponente, nicht im Callback.

const SIZES: {size: DropdownSize; label: string}[] = [
  {size: 'sm', label: 'sm · 26 px'},
  {size: 'chip', label: 'chip · 32 px'},
  {size: 'md', label: 'md · 36 px'},
]

function SizeMatrix({render}: {render: (size: DropdownSize) => ReactNode}) {
  return (
    <div className="flex items-end gap-6">
      {SIZES.map(({size, label}) => (
        <div key={size} className="flex flex-col gap-1.5">
          <span className="text-xs text-muted-foreground">{label}</span>
          {render(size)}
        </div>
      ))}
    </div>
  )
}

// ─── Variante 1: Nur Text ─────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  {value: 'open', label: 'Offen'},
  {value: 'done', label: 'Erledigt'},
  {value: 'blocked', label: 'Blockiert'},
]

function TextVariant({size}: {size: DropdownSize}) {
  const [value, setValue] = useState<string | null>(null)
  return <Dropdown size={size} value={value} onChange={setValue} allLabel="Alle Status" options={STATUS_OPTIONS} />
}

export const TextOnly: Story = {
  name: 'Nur Text',
  render: () => <SizeMatrix render={size => <TextVariant size={size} />} />,
}

// ─── Variante 2: Inline-Icon ──────────────────────────────────────────────────
// `icon` pro Option = kleines Inline-Symbol (size-4). Erscheint bei aktiver
// Option auch im Trigger. Vorausgewählt, damit das Trigger-Icon sichtbar ist.

const TYPE_OPTIONS = [
  {value: 'task', label: 'Aufgabe', icon: <ListTodo className="size-4" />},
  {value: 'inbox', label: 'Inbox', icon: <Inbox className="size-4" />},
  {value: 'tag', label: 'Tag', icon: <Tag className="size-4" />},
]

function InlineIconVariant({size}: {size: DropdownSize}) {
  const [value, setValue] = useState<string | null>('task')
  return <Dropdown size={size} value={value} onChange={setValue} allLabel="Alle Typen" options={TYPE_OPTIONS} />
}

export const WithInlineIcon: Story = {
  name: 'Inline-Icon',
  render: () => <SizeMatrix render={size => <InlineIconVariant size={size} />} />,
}

// ─── Variante 3: Inline-Icon + Trailing-Meta-Label ───────────────────────────
// `meta` = kurzes sekundäres Label rechts in der Row (muted, mono). Erscheint
// nur im Popover, nicht im Trigger. Typisches Prioritäts-Filter-Pattern.

const dot = (cls: string) => <span className={`inline-block size-2.5 rounded-full ${cls}`} />
const PRIO_OPTIONS = [
  {value: 'critical', label: 'Kritisch', icon: dot('bg-rose-500'), meta: 'P0'},
  {value: 'high', label: 'Hoch', icon: dot('bg-orange-500'), meta: 'P1'},
  {value: 'mid', label: 'Mittel', icon: dot('bg-amber-400'), meta: 'P2'},
  {value: 'low', label: 'Niedrig', icon: dot('bg-zinc-400'), meta: 'P3'},
]

function MetaVariant({size}: {size: DropdownSize}) {
  const [value, setValue] = useState<string | null>('high')
  return <Dropdown size={size} value={value} onChange={setValue} allLabel="Alle Prioritäten" options={PRIO_OPTIONS} />
}

export const WithMeta: Story = {
  name: 'Inline-Icon + Meta-Label rechts',
  render: () => <SizeMatrix render={size => <MetaVariant size={size} />} />,
}

// ─── Variante 4: Deaktivierte Optionen ───────────────────────────────────────

const PARTIALLY_DISABLED = [
  {value: 'open', label: 'Offen'},
  {value: 'done', label: 'Erledigt'},
  {value: 'blocked', label: 'Blockiert (gesperrt)', disabled: true},
  {value: 'archived', label: 'Archiviert', disabled: true},
]

function DisabledVariant({size}: {size: DropdownSize}) {
  const [value, setValue] = useState<string | null>(null)
  return <Dropdown size={size} value={value} onChange={setValue} allLabel="Alle Status" options={PARTIALLY_DISABLED} />
}

export const WithDisabledOptions: Story = {
  name: 'Deaktivierte Optionen',
  render: () => <SizeMatrix render={size => <DisabledVariant size={size} />} />,
}

// ─── Variante 5: Langer Label (Truncation) ───────────────────────────────────
// `tailMaxWidth` greift pro Größe (sm 140 / chip 160 / md 180 px) — im Trigger
// und in den Rows.

const LONG_OPTIONS = [
  {value: 'long', label: 'Sehr langer Kategoriename der abgeschnitten wird'},
  {value: 'also-long', label: 'Noch ein langer Name für eine Kategorie'},
  {value: 'short', label: 'Kurz'},
]

function LongLabelVariant({size}: {size: DropdownSize}) {
  const [value, setValue] = useState<string | null>('long')
  return <Dropdown size={size} value={value} onChange={setValue} allLabel="Alle Kategorien" options={LONG_OPTIONS} />
}

export const LongLabel: Story = {
  name: 'Langer Label (Truncation)',
  render: () => <SizeMatrix render={size => <LongLabelVariant size={size} />} />,
}

// ─── Variante 6: Compound — border-flush Square-Icon ─────────────────────────
// Dieselben Compound-Teile wie BucketDropdown, neutrale Demo-Daten. Das Square
// skaliert mit der Größe (DROPDOWN_SIZE[size].iconBox = 24/30/34).

const DEMO_FOLDERS = [
  {id: 'f1', label: 'Favoriten', icon: <Folder className="size-3.5 text-sky-500" />, bg: 'bg-sky-500/15'},
  {id: 'f2', label: 'Dokumente', icon: <FileText className="size-3.5 text-violet-500" />, bg: 'bg-violet-500/15'},
  {id: 'f3', label: 'Archiv', icon: <Archive className="size-3.5 text-zinc-500" />, bg: 'bg-zinc-500/15'},
]

function squareTriggerIcon(selected: (typeof DEMO_FOLDERS)[number] | null, size: DropdownSize) {
  const geo = DROPDOWN_SIZE[size]
  const dim = {width: geo.iconBox, height: geo.iconBox}
  if (selected) {
    return <span className={`grid place-items-center shrink-0 ${selected.bg}`} style={dim}>{selected.icon}</span>
  }
  return (
    <span className="grid place-items-center shrink-0 text-primary" style={{...dim, background: 'hsl(var(--primary) / 0.12)'}}>
      <Folder className="size-3" />
    </span>
  )
}

function CompoundSquareVariant({size}: {size: DropdownSize}) {
  const [value, setValue] = useState<string | null>(null)
  const selected = value ? DEMO_FOLDERS.find(f => f.id === value) ?? null : null
  return (
    <Dropdown.Root value={value} onValueChange={setValue}>
      <Dropdown.Pill
        size={size}
        icon={squareTriggerIcon(selected, size)}
        aria-label={selected ? `Ordner: ${selected.label}` : 'Alle Ordner'}
      >
        {selected ? selected.label : 'Alle Ordner'}
      </Dropdown.Pill>
      <Dropdown.Content>
        <Dropdown.AllRow icon={<Folder className="size-3.5" />}>Alle Ordner</Dropdown.AllRow>
        {DEMO_FOLDERS.map(f => (
          <Dropdown.Row key={f.id} value={f.id} icon={f.icon}>
            {f.label}
          </Dropdown.Row>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  )
}

export const CompoundSquareIcon: Story = {
  name: 'Compound — Square-Icon border-flush (wie BucketDropdown)',
  render: () => <SizeMatrix render={size => <CompoundSquareVariant size={size} />} />,
}

// ─── Icon-Slot: was passt rein? ──────────────────────────────────────────────
// Der `icon`-Slot nimmt einen beliebigen ReactNode. Drei typische Belegungen
// (alle in Größe md):
//   1. Inline-Icon — kleines Symbol (lucide size-4), Convenience-Pfad,
//      automatisch links gepaddet.
//   2. Getöntes Square + Glyph — full-height Quadrat (iconBox) mit Glyph,
//      Compound-Pfad, border-flush (BucketDropdown-Stil).
//   3. Vollflächiges Bild — `<img object-cover>` füllt das Quadrat randlos und
//      wird in die Pill-Rundung geclippt (ContextDropdown-Stil, Org-Logos).
// Neutraler Demo-„Logo"-Verlauf als data-URI, damit die Story self-contained
// bleibt (echte Org-PNGs siehe ContextDropdown-Story).

const DEMO_LOGO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%237c3aed'/><stop offset='1' stop-color='%230ea5e9'/></linearGradient></defs><rect width='48' height='48' fill='url(%23g)'/><text x='24' y='33' font-size='26' fill='white' text-anchor='middle' font-family='sans-serif'>M</text></svg>"

function InlineSlotDemo() {
  const [value, setValue] = useState<string | null>('starred')
  return (
    <Dropdown
      size="md"
      value={value}
      onChange={setValue}
      allLabel="Beispiel"
      options={[
        {value: 'starred', label: 'Markiert', icon: <Star className="size-4" />},
        {value: 'tagged', label: 'Getaggt', icon: <Tag className="size-4" />},
      ]}
    />
  )
}

function SquareSlotDemo() {
  const [value, setValue] = useState<string | null>('x')
  const box = {width: DROPDOWN_SIZE.md.iconBox, height: DROPDOWN_SIZE.md.iconBox}
  return (
    <Dropdown.Root value={value} onValueChange={setValue}>
      <Dropdown.Pill
        size="md"
        icon={
          <span className="grid place-items-center shrink-0 bg-sky-500/15" style={box}>
            <Folder className="size-3.5 text-sky-600" />
          </span>
        }
        aria-label="Square + Glyph"
      >
        Square + Glyph
      </Dropdown.Pill>
      <Dropdown.Content>
        <Dropdown.AllRow icon={<Folder className="size-3.5" />}>Alle</Dropdown.AllRow>
        <Dropdown.Row value="x" icon={<Folder className="size-4 text-sky-600" />}>Beispiel-Eintrag</Dropdown.Row>
      </Dropdown.Content>
    </Dropdown.Root>
  )
}

function ImageSlotDemo() {
  const [value, setValue] = useState<string | null>('x')
  const box = {width: DROPDOWN_SIZE.md.iconBox, height: DROPDOWN_SIZE.md.iconBox}
  return (
    <Dropdown.Root value={value} onValueChange={setValue}>
      <Dropdown.Pill
        size="md"
        icon={
          <span className="grid place-items-center shrink-0 overflow-hidden" style={box}>
            <img src={DEMO_LOGO} alt="" className="h-full w-full object-cover" />
          </span>
        }
        aria-label="Vollflächiges Bild"
      >
        Vollflächiges Bild
      </Dropdown.Pill>
      <Dropdown.Content>
        <Dropdown.AllRow>Alle</Dropdown.AllRow>
        <Dropdown.Row
          value="x"
          icon={
            <span className="grid place-items-center shrink-0 overflow-hidden rounded-sm" style={{width: 22, height: 22}}>
              <img src={DEMO_LOGO} alt="" className="h-full w-full object-cover" />
            </span>
          }
        >
          Beispiel-Eintrag
        </Dropdown.Row>
      </Dropdown.Content>
    </Dropdown.Root>
  )
}

export const IconSlotKinds: Story = {
  name: 'Icon-Slot — was passt rein? (inline / square / Bild)',
  render: () => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Inline-Icon</span>
        <InlineSlotDemo />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Getöntes Square + Glyph</span>
        <SquareSlotDemo />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Vollflächiges Bild</span>
        <ImageSlotDemo />
      </div>
    </div>
  ),
}

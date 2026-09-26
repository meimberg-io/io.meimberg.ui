---
'@meimberg/ui': minor
---

IconButton erweitert, neues Atom `DragHandle`.

**`IconButton`:**

- Neue Varianten `outline` (1px-Rahmen `border-border`, `bg-card`, Icon gedämpft; bei Hover nehmen Text, Rahmen und Hintergrund `/10` den Ton an, neutral: `text-foreground`, `border-foreground/30`, `bg-surface-2`) und `solid` (mit dem Ton gefüllt, `bg-<tone> text-<tone>-foreground`; neutral: `bg-secondary`). `quiet` (Default) und `ghost` bleiben.
- Neuer Ton `warning`; Typ `IconButtonTone` (`neutral | primary | success | warning | destructive`) statt `ButtonTone`.
- `pressed?: boolean` für Toggle-Buttons (Stern, Flagge …): setzt `aria-pressed` und `data-state="on|off"`; „an" hält den Ton auch in Ruhe (quiet/ghost: Ton-Text + `bg-<tone>/10`, outline: Ton-Rahmen + Text + `/10`, solid: Füllung plus dezenter Inset-Ring). Hover-Reveal-Wrapper sollten einen gedrückten Button nicht verstecken — das entscheidet die Aufrufstelle.
- `asChild` (Radix Slot) wie beim `Button`, z. B. für `next/link`; `type="button"` nur ohne `asChild`.
- `shape?: 'rounded' | 'circle'` (Default `rounded` = `rounded-md`).
- Größen bleiben auf der Control-Skala (xs 26 · sm 32 · md 36 · lg 40) mit fester Icon-Zuordnung — bewusst keine Zwischengrößen und kein Icon-Override.

**Neu: `DragHandle`** (Atom, Bereich core) — Griff für Drag-and-drop-Sortierung, 24×32 px, `GripVertical` 14 px, `cursor-grab`/`active:cursor-grabbing`, `touch-none`, Tap-Fläche auf Touch. Reicht alle Button-Props und die Ref durch, sodass dnd-kit `attributes`/`listeners` per Spread anhängen kann. Label über `labels` (Schlüssel `dragHandle`, Default „Drag to reorder", deutsch „Zum Sortieren ziehen").

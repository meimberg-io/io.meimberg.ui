// PUL-462 (Schritt 6): Absolute Datums-Formatierung — Util-Kern des
// DS-Packages (Konsument: DatePicker). Aus app/src/lib/datetime.ts
// extrahiert; die relativen/fachlichen Formatter (formatRelativeTime,
// formatDueDate, formatReceivedDate) bleiben in der App, weil sie an
// deren i18n-Modul (formatCount) hängen.

type Input = Date | string

function toDate(d: Input): Date {
  return typeof d === 'string' ? new Date(d) : d
}

const listFormatter = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const detailFormatter = new Intl.DateTimeFormat('de-DE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatAbsoluteDate(date: Input, mode: 'list' | 'detail'): string {
  const d = toDate(date)
  return mode === 'list' ? listFormatter.format(d) : detailFormatter.format(d)
}

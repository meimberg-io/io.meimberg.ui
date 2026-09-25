// Absolute Datums-Formatierung (Konsument: DatePicker). Formatter werden pro
// Locale und Modus gecacht, weil Intl.DateTimeFormat teuer zu erzeugen ist.

type Input = Date | string
type Mode = 'list' | 'detail'

const OPTIONS: Record<Mode, Intl.DateTimeFormatOptions> = {
  list: {day: 'numeric', month: 'long', year: 'numeric'},
  detail: {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'},
}

const cache = new Map<string, Intl.DateTimeFormat>()

function formatter(locale: string, mode: Mode): Intl.DateTimeFormat {
  const key = `${locale}|${mode}`
  let f = cache.get(key)
  if (!f) {
    f = new Intl.DateTimeFormat(locale, OPTIONS[mode])
    cache.set(key, f)
  }
  return f
}

export function formatAbsoluteDate(date: Input, mode: Mode, locale: string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatter(locale, mode).format(d)
}

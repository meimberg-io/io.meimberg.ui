import { describe, expect, it } from 'vitest'
import { formatAbsoluteDate } from './datetime'

describe('formatAbsoluteDate', () => {
  it('list mode in German', () => {
    expect(formatAbsoluteDate(new Date('2026-05-04T10:00:00'), 'list', 'de-DE')).toBe('4. Mai 2026')
  })
  it('list mode in English', () => {
    expect(formatAbsoluteDate(new Date('2026-05-04T10:00:00'), 'list', 'en-US')).toBe('May 4, 2026')
  })
  it('detail mode adds hours:minutes', () => {
    const formatted = formatAbsoluteDate(new Date('2026-05-04T19:41:20'), 'detail', 'de-DE')
    expect(formatted).toContain('4. Mai 2026')
    expect(formatted).toContain('19:41')
    expect(formatted).not.toContain(':20')
  })
  it('handles year boundaries', () => {
    expect(formatAbsoluteDate(new Date('2026-01-01T08:00:00'), 'list', 'de-DE')).toBe('1. Januar 2026')
    expect(formatAbsoluteDate(new Date('2026-12-31T22:00:00'), 'list', 'de-DE')).toBe('31. Dezember 2026')
  })
  it('accepts ISO strings', () => {
    expect(formatAbsoluteDate('2026-05-04T10:00:00', 'list', 'de-DE')).toBe('4. Mai 2026')
  })
})

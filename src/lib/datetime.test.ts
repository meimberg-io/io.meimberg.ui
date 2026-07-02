// PUL-462 (Schritt 6): aus app/src/lib/datetime.test.ts mit umgezogen.
import { describe, expect, it } from 'vitest'
import { formatAbsoluteDate } from './datetime'

describe('formatAbsoluteDate', () => {
  it('list mode returns "DD. MMMM YYYY"', () => {
    expect(formatAbsoluteDate(new Date('2026-05-04T10:00:00'), 'list')).toBe('4. Mai 2026')
  })
  it('detail mode adds hours:minutes', () => {
    const formatted = formatAbsoluteDate(new Date('2026-05-04T19:41:20'), 'detail')
    expect(formatted).toContain('4. Mai 2026')
    expect(formatted).toContain('19:41')
    expect(formatted).not.toContain(':20')
  })
  it('handles January 1 correctly', () => {
    expect(formatAbsoluteDate(new Date('2026-01-01T08:00:00'), 'list')).toBe('1. Januar 2026')
  })
  it('handles December 31 correctly', () => {
    expect(formatAbsoluteDate(new Date('2026-12-31T22:00:00'), 'list')).toBe('31. Dezember 2026')
  })
})

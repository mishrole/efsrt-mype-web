import { afterEach, describe, expect, it, vi } from "vitest"
import { formatDateTime, getCurrentLocalDate, today } from "~/shared/utils/date"

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
})

describe("date utils", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  describe("today", () => {
    it("returns the current UTC date in ISO format", () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date("2026-10-16T23:59:59.000Z"))

      expect(today()).toBe("2026-10-16")
    })

    it("uses the UTC date when the local date could differ", () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date("2026-10-17T00:00:00.000Z"))

      expect(today()).toBe("2026-10-17")
    })
  })

  describe("formatDateTime", () => {
    it("formats a valid date with the configured locale", () => {
      const dateTime = "2026-10-16T13:45:00"
      const expectedDateTime = DATE_TIME_FORMATTER.format(new Date(dateTime))

      expect(formatDateTime(dateTime)).toBe(expectedDateTime)
    })

    it("formats midnight without losing the date", () => {
      const dateTime = "2026-10-16T00:00:00"
      const expectedDateTime = DATE_TIME_FORMATTER.format(new Date(dateTime))

      expect(formatDateTime(dateTime)).toBe(expectedDateTime)
    })

    it("returns the original value when the date is invalid", () => {
      const invalidDateTime = "invalid-date"

      expect(formatDateTime(invalidDateTime)).toBe(invalidDateTime)
    })

    it("returns an empty value unchanged", () => {
      expect(formatDateTime("")).toBe("")
    })
  })

  describe("getCurrentLocalDate", () => {
    it("returns the current local date in ISO format", () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date("2026-10-16T12:00:00.000Z"))

      expect(getCurrentLocalDate()).toBe("2026-10-16")
    })

    it("preserves the local calendar date near the end of the day", () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 9, 16, 23, 59, 59))

      expect(getCurrentLocalDate()).toBe("2026-10-16")
    })

    it("advances when the local calendar reaches the next day", () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date(2026, 9, 17, 0, 0, 0))

      expect(getCurrentLocalDate()).toBe("2026-10-17")
    })
  })
})

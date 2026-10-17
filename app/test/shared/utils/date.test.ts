import { afterEach, describe, expect, it, vi } from "vitest"
import { today } from "~/shared/utils/date"

describe("today", () => {
  afterEach(() => vi.useRealTimers())

  it("returns the current UTC date in ISO format", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-10-16T23:59:59.000Z"))
    expect(today()).toBe("2026-10-16")
  })
})

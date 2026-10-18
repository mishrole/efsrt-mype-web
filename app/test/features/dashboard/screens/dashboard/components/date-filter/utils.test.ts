import { describe, expect, it } from "vitest"
import {
  formatDateLabel,
  formatDateValue,
  parseDateValue,
} from "~/features/dashboard/screens/dashboard/components/date-filter/utils"

describe("date-filter utils", () => {
  it("parses and formats a valid local date without changing its day", () => {
    const date = parseDateValue("2026-10-02")

    expect(date).toEqual(new Date(2026, 9, 2))
    expect(formatDateValue(date as Date)).toBe("2026-10-02")
    expect(formatDateLabel("2026-10-02")).toBe("02/10/2026")
  })

  it("rejects invalid values and returns the empty label", () => {
    expect(parseDateValue("2026-02-30")).toBeUndefined()
    expect(parseDateValue("invalid")).toBeUndefined()
    expect(formatDateLabel("")).toBe("Seleccionar fecha")
  })
})

import { describe, expect, it } from "vitest"
import { FinancialDashboardGranularity } from "~/services/financial-dashboard/get-financial-dashboard/interfaces"
import { createFinancialDashboardQuery } from "~/services/financial-dashboard/get-financial-dashboard/utils"

describe("createFinancialDashboardQuery", () => {
  it("returns an empty query without filters", () => {
    expect(createFinancialDashboardQuery({})).toBe("")
  })

  it("includes dates and the Auto granularity", () => {
    expect(
      createFinancialDashboardQuery({
        dateFrom: "2026-10-01",
        dateTo: "2026-10-16",
        granularity: FinancialDashboardGranularity.Auto,
      }),
    ).toBe("?dateFrom=2026-10-01&dateTo=2026-10-16&granularity=0")
  })

  it("omits empty dates and preserves another granularity", () => {
    expect(
      createFinancialDashboardQuery({
        dateFrom: "",
        dateTo: "",
        granularity: FinancialDashboardGranularity.Month,
      }),
    ).toBe("?granularity=3")
  })
})

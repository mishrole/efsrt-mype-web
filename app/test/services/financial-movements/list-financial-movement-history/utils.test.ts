import { describe, expect, it } from "vitest"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"
import { createFinancialMovementHistoryQuery } from "~/services/financial-movements/list-financial-movement-history/utils"

describe("createFinancialMovementHistoryQuery", () => {
  it("returns an empty query when optional filters are omitted", () => {
    expect(createFinancialMovementHistoryQuery({})).toBe("")
  })

  it("serializes every supported filter in the API contract order", () => {
    expect(
      createFinancialMovementHistoryQuery({
        type: 1,
        status: FinancialMovementStatus.Confirmed,
        dateFrom: "2026-10-01",
        dateTo: "2026-10-31",
        categoryId: "category-id",
        page: 2,
        pageSize: 50,
      }),
    ).toBe(
      "?type=1&status=2&dateFrom=2026-10-01&dateTo=2026-10-31&categoryId=category-id&page=2&pageSize=50",
    )
  })

  it("omits empty date and category values without replacing backend defaults", () => {
    expect(
      createFinancialMovementHistoryQuery({
        dateFrom: "",
        dateTo: "",
        categoryId: "",
      }),
    ).toBe("")
  })
})

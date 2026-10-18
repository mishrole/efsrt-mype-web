import { describe, expect, it } from "vitest"
import { buildMetrics } from "~/features/dashboard/screens/dashboard/components/financial-summary/utils"
import { FinancialDashboardGranularity } from "~/services/financial-dashboard/get-financial-dashboard/interfaces"

const dashboard = {
  businessId: "business-id",
  currencyCode: "PEN",
  dateFrom: "2026-10-01",
  dateTo: "2026-10-16",
  granularity: FinancialDashboardGranularity.Day,
  openingBalance: 1000,
  cashInflow: 100,
  cashOutflow: 250,
  netCashFlow: -150,
  closingBalance: 850,
  estimatedCost: 200,
  estimatedGrossMargin: -100,
  confirmedSaleCount: 1,
  confirmedExpenseCount: 1,
  averageSaleAmount: 100,
  trend: [],
  saleByCategory: [],
  expenseByCategory: [],
}

describe("buildMetrics", () => {
  it("uses the negative tone for a negative net cash flow", () => {
    expect(buildMetrics(dashboard)[3]).toEqual(["Flujo neto", -150, "negative"])
  })
})

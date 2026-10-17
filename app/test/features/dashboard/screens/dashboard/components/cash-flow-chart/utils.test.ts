import { describe, expect, it } from "vitest"
import {
  calculateXAxisInterval,
  createCashFlowChartData,
  formatCompactCurrency,
  formatCurrency,
} from "../../../../../../../features/dashboard/screens/dashboard/components/cash-flow-chart/utils"

describe("cash flow chart utilities", () => {
  it("creates labels for single-day and ranged points", () => {
    expect(
      createCashFlowChartData([
        {
          dateFrom: "2026-10-01",
          dateTo: "2026-10-01",
          cashInflow: 100,
          cashOutflow: 20,
          netCashFlow: 80,
          closingBalance: 1080,
        },
        {
          dateFrom: "2026-10-02",
          dateTo: "2026-10-08",
          cashInflow: 200,
          cashOutflow: 50,
          netCashFlow: 150,
          closingBalance: 1230,
        },
      ]).map((point) => point.periodLabel),
    ).toEqual(["01/10", "02/10 - 08/10"])
  })

  it.each([
    [7, 0],
    [8, 1],
    [14, 1],
    [15, 2],
    [30, 4],
  ])("calculates the interval for %s points", (pointCount, interval) => {
    expect(calculateXAxisInterval(pointCount)).toBe(interval)
  })

  it("formats full and compact currency values", () => {
    expect(formatCurrency(1000, "PEN")).toMatch(/^S\/\s*1,000\.00$/)
    expect(formatCompactCurrency(1000, "PEN")).toMatch(/^S\/\s*1(?:\.0)?\s*K$/i)
  })
})

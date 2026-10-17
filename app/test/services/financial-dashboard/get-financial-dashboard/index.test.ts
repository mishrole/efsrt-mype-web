import { describe, expect, it, vi } from "vitest"
import { getFinancialDashboard } from "~/services/financial-dashboard/get-financial-dashboard"
import { FinancialDashboardGranularity } from "~/services/financial-dashboard/get-financial-dashboard/interfaces"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("getFinancialDashboard service", () => {
  it("gets the dashboard with filters and forwards the abort signal", async () => {
    const controller = new AbortController()
    const response = {
      businessId: "business-id",
      currencyCode: "PEN",
      dateFrom: "2026-10-01",
      dateTo: "2026-10-16",
      granularity: FinancialDashboardGranularity.Day,
      openingBalance: 1000,
      cashInflow: 500,
      cashOutflow: 200,
      netCashFlow: 300,
      closingBalance: 1300,
      estimatedCost: 100,
      estimatedGrossMargin: 400,
      confirmedSaleCount: 2,
      confirmedExpenseCount: 1,
      averageSaleAmount: 250,
      trend: [],
      saleByCategory: [],
      expenseByCategory: [],
    }

    requestMock.mockResolvedValue(response)

    await expect(
      getFinancialDashboard(
        {
          businessId: "business-id",
          dateFrom: "2026-10-01",
          dateTo: "2026-10-16",
          granularity: FinancialDashboardGranularity.Day,
        },
        "access-token",
        controller.signal,
      ),
    ).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(
      `${API_ROUTES.FINANCIAL_DASHBOARD("business-id")}?dateFrom=2026-10-01&dateTo=2026-10-16&granularity=1`,
      {
        method: "GET",
        accessToken: "access-token",
        signal: controller.signal,
      },
    )
  })
})

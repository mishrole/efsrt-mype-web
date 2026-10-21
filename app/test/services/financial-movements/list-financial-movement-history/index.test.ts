import { describe, expect, it, vi } from "vitest"
import { listFinancialMovementHistory } from "~/services/financial-movements/list-financial-movement-history"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("listFinancialMovementHistory service", () => {
  it("gets the filtered page and forwards the abort signal", async () => {
    const controller = new AbortController()
    const response = {
      items: [],
      page: 1,
      pageSize: 20,
      totalCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    }

    requestMock.mockResolvedValue(response)

    await expect(
      listFinancialMovementHistory(
        {
          businessId: "business-id",
          type: 2,
          status: FinancialMovementStatus.Cancelled,
          dateFrom: "2026-10-01",
          dateTo: "2026-10-31",
          categoryId: "category-id",
          page: 1,
          pageSize: 20,
        },
        "access-token",
        controller.signal,
      ),
    ).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(
      `${API_ROUTES.FINANCIAL_MOVEMENT_HISTORY("business-id")}?type=2&status=3&dateFrom=2026-10-01&dateTo=2026-10-31&categoryId=category-id&page=1&pageSize=20`,
      {
        method: "GET",
        accessToken: "access-token",
        signal: controller.signal,
      },
    )
  })

  it("keeps dates and pagination omitted so the backend applies its defaults", async () => {
    requestMock.mockResolvedValue({
      items: [],
      page: 1,
      pageSize: 20,
      totalCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    })

    await listFinancialMovementHistory(
      { businessId: "business-id" },
      "access-token",
    )

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.FINANCIAL_MOVEMENT_HISTORY("business-id"),
      {
        method: "GET",
        accessToken: "access-token",
        signal: undefined,
      },
    )
  })
})

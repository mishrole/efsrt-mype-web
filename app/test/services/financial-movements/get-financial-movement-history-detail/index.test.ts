import { describe, expect, it, vi } from "vitest"
import { getFinancialMovementHistoryDetail } from "~/services/financial-movements/get-financial-movement-history-detail"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("getFinancialMovementHistoryDetail service", () => {
  it("gets the historical detail and forwards the abort signal", async () => {
    const controller = new AbortController()
    const response = {
      id: "movement-id",
      businessId: "business-id",
      type: 1 as const,
      status: 2 as const,
      movementDate: "2026-10-05",
      description: "Venta del turno mañana",
      currencyCode: "PEN",
      totalAmount: 80,
      createdByUserId: "creator-id",
      updatedByUserId: "updater-id",
      confirmedByUserId: "confirmer-id",
      cancelledByUserId: null,
      cancellationReason: null,
      createdAt: "2026-10-05T20:00:00Z",
      updatedAt: "2026-10-05T21:15:00Z",
      confirmedAt: "2026-10-05T21:15:00Z",
      cancelledAt: null,
      discardedAt: null,
      estimatedCost: 40,
      estimatedMargin: 40,
      isEditable: false,
      allowedActions: [],
      version: 1,
      items: [],
      evidences: [],
    }

    requestMock.mockResolvedValue(response)

    await expect(
      getFinancialMovementHistoryDetail(
        "business-id",
        "movement-id",
        "access-token",
        controller.signal,
      ),
    ).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.FINANCIAL_MOVEMENT_HISTORY_DETAIL(
        "business-id",
        "movement-id",
      ),
      {
        method: "GET",
        accessToken: "access-token",
        signal: controller.signal,
      },
    )
  })
})

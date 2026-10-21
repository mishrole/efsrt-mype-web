import { beforeEach, describe, expect, it, vi } from "vitest"
import { retireFinancialMovementItem } from "~/services/financial-movements/retire-financial-movement-item"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))
const requestMock = vi.mocked(request)

describe("retireFinancialMovementItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestMock.mockResolvedValue({})
  })
  it("uses its route, method, payload and token", async () => {
    const businessId = "business-id"
    const movementId = "movement-id"
    const itemId = "item-id"
    const accessToken = "access-token"
    const payload = {
      movementVersion: 3,
      itemVersion: 2,
      productId: "product-id",
      categoryId: "category-id",
      description: "Taxi",
      quantity: 2,
      unitAmount: 5,
    } as never
    await retireFinancialMovementItem(
      businessId,
      movementId,
      itemId,
      payload,
      accessToken,
    )
    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.FINANCIAL_MOVEMENT_ITEM_RETIRE(businessId, movementId, itemId),
      { method: "PATCH", body: payload, accessToken },
    )
  })
})

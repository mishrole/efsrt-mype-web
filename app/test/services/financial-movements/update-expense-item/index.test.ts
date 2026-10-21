import { beforeEach, describe, expect, it, vi } from "vitest"
import { updateExpenseItem } from "~/services/financial-movements/update-expense-item"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))
const requestMock = vi.mocked(request)

describe("updateExpenseItem", () => {
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
    await updateExpenseItem(
      businessId,
      movementId,
      itemId,
      payload,
      accessToken,
    )
    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.EXPENSE_ITEM_DETAIL(businessId, movementId, itemId),
      { method: "PUT", body: payload, accessToken },
    )
  })
})

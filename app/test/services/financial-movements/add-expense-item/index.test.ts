import { beforeEach, describe, expect, it, vi } from "vitest"
import { addExpenseItem } from "~/services/financial-movements/add-expense-item"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))
const requestMock = vi.mocked(request)

describe("addExpenseItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestMock.mockResolvedValue({})
  })
  it("uses its route, method, payload and token", async () => {
    const businessId = "business-id"
    const movementId = "movement-id"
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
    await addExpenseItem(businessId, movementId, payload, accessToken)
    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.EXPENSE_ITEMS(businessId, movementId),
      { method: "POST", body: payload, accessToken },
    )
  })
})

import { describe, expect, it, vi } from "vitest"
import { confirmFinancialMovement } from "~/services/financial-movements/confirm-financial-movement"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))

describe("confirmFinancialMovement", () => {
  it("posts movement and item versions with the access token", async () => {
    const payload = {
      movementVersion: 7,
      itemVersions: [
        { itemId: "item-1", version: 2 },
        { itemId: "item-2", version: 4 },
      ],
    }
    vi.mocked(request).mockResolvedValue({})

    await confirmFinancialMovement(
      "business-id",
      "movement-id",
      payload,
      "access-token",
    )

    expect(request).toHaveBeenCalledWith(
      API_ROUTES.FINANCIAL_MOVEMENT_CONFIRM("business-id", "movement-id"),
      {
        method: "POST",
        body: payload,
        accessToken: "access-token",
      },
    )
  })
})

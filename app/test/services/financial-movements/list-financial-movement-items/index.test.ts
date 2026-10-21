import { expect, it, vi } from "vitest"
import { listFinancialMovementItems } from "~/services/financial-movements/list-financial-movement-items"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))
it("lists active items with token and signal", async () => {
  const signal = new AbortController().signal
  vi.mocked(request).mockResolvedValue({ items: [] })
  await listFinancialMovementItems(
    "business-id",
    "movement-id",
    "access-token",
    signal,
  )
  expect(request).toHaveBeenCalledWith(
    API_ROUTES.FINANCIAL_MOVEMENT_ITEMS("business-id", "movement-id"),
    { method: "GET", accessToken: "access-token", signal },
  )
})

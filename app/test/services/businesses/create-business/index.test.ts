import { describe, expect, it, vi } from "vitest"
import { createBusiness } from "~/services/businesses/create-business"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("createBusiness service", () => {
  it("posts the initial business contract", async () => {
    const controller = new AbortController()
    const payload = {
      displayName: "Pepito Grillo S.A.C.",
      legalName: "Pepito Grillo S.A.C.",
      ruc: "20123456789",
      currencyCode: "PEN",
      openingBalanceAmount: 1000,
      openingBalanceDate: "2026-10-16",
    }
    const response = {
      businessId: "business-id",
      displayName: payload.displayName,
      currencyCode: payload.currencyCode,
      membershipId: "membership-id",
      roleCode: "OWNER",
      defaultCategories: [],
      openingBalanceMovementId: "movement-id",
      openingBalanceAmount: payload.openingBalanceAmount,
      openingBalanceDate: payload.openingBalanceDate,
      version: 1,
    }

    requestMock.mockResolvedValue(response)

    await expect(
      createBusiness(payload, "access-token", controller.signal),
    ).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(API_ROUTES.BUSINESSES, {
      method: "POST",
      body: payload,
      accessToken: "access-token",
      signal: controller.signal,
    })
  })
})

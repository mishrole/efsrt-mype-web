import { describe, expect, it, vi } from "vitest"
import { getBusinessContext } from "~/services/businesses/get-business-context"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("getBusinessContext service", () => {
  it("gets the selected business context", async () => {
    const controller = new AbortController()
    const response = {
      businessId: "business-id",
      displayName: "Pepito Grillo S.A.C.",
      currencyCode: "PEN",
      membershipId: "membership-id",
      roleId: "role-id",
      roleCode: "OWNER",
      permissions: ["DASHBOARD_READ"],
    }

    requestMock.mockResolvedValue(response)

    await expect(
      getBusinessContext("business-id", "access-token", controller.signal),
    ).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.BUSINESS_CONTEXT("business-id"),
      {
        method: "GET",
        accessToken: "access-token",
        signal: controller.signal,
      },
    )
  })
})

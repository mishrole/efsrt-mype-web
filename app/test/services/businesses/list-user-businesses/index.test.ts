import { describe, expect, it, vi } from "vitest"
import { listUserBusinesses } from "~/services/businesses/list-user-businesses"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("listUserBusinesses service", () => {
  it("gets the businesses with the access token and abort signal", async () => {
    const controller = new AbortController()
    const response = [
      {
        businessId: "business-id",
        displayName: "Pepito Grillo S.A.C.",
        currencyCode: "PEN",
        status: 1,
        membershipId: "membership-id",
        roleCode: "OWNER",
      },
    ]

    requestMock.mockResolvedValue(response)

    await expect(
      listUserBusinesses("access-token", controller.signal),
    ).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(API_ROUTES.BUSINESSES, {
      method: "GET",
      accessToken: "access-token",
      signal: controller.signal,
    })
  })
})

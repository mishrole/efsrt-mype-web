import { describe, expect, it, vi } from "vitest"
import type { RequestOptions } from "~/shared/http/client/interfaces"
import { logout } from "../../../../services/auth/logout"
import { API_ROUTES } from "../../../../shared/constants/api"
import { request } from "../../../../shared/http/client"

vi.mock("../../../../shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("logout service", () => {
  it("posts without a body, includes cookies, forwards the signal and resolves void", async () => {
    const controller = new AbortController()

    requestMock.mockResolvedValue(undefined)

    await expect(logout(controller.signal)).resolves.toBeUndefined()

    const options: RequestOptions = {
      method: "POST",
      credentials: "include",
      signal: controller.signal,
      skipAuthRefresh: true,
    }

    expect(requestMock).toHaveBeenCalledWith(API_ROUTES.AUTH.LOGOUT, options)

    expect(requestMock).not.toHaveBeenCalledWith(
      API_ROUTES.AUTH.LOGOUT,
      expect.objectContaining({
        body: expect.anything(),
      }),
    )
  })
})

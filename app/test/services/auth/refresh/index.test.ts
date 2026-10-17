import { describe, expect, it, vi } from "vitest"
import type { RequestOptions } from "~/shared/http/client/interfaces"
import { refreshSession } from "../../../../services/auth/refresh"
import { API_ROUTES } from "../../../../shared/constants/api"
import { request } from "../../../../shared/http/client"

vi.mock("../../../../shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("refreshSession service", () => {
  it("posts without a body, includes cookies and forwards the abort signal", async () => {
    const controller = new AbortController()
    const response = {
      accessToken: "renewed-access-token",
      tokenType: "Bearer",
      expiresAt: "2026-10-15T05:58:05.4315335+00:00",
      user: {
        id: "750d0043-7495-4bdc-9215-ff9780489db9",
        email: "correo@gmail.com",
        displayName: "Mitchell Rodríguez",
        status: 1,
      },
    }

    requestMock.mockResolvedValue(response)

    await expect(refreshSession(controller.signal)).resolves.toEqual(response)

    const options: RequestOptions = {
      method: "POST",
      credentials: "include",
      signal: controller.signal,
      skipAuthRefresh: true,
    }

    expect(requestMock).toHaveBeenCalledWith(API_ROUTES.AUTH.REFRESH, options)

    expect(requestMock).not.toHaveBeenCalledWith(
      API_ROUTES.AUTH.REFRESH,
      expect.objectContaining({
        body: expect.anything(),
      }),
    )
  })
})

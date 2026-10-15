import { describe, expect, it, vi } from "vitest"
import { login } from "../../../../services/auth/login"
import { API_ROUTES } from "../../../../shared/constants/api"
import { request } from "../../../../shared/http/client"

vi.mock("../../../../shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("login service", () => {
  it("posts the credentials with cookies and forwards the abort signal", async () => {
    const controller = new AbortController()
    const payload = {
      email: "correo@gmail.com",
      password: "password1",
    }
    const response = {
      accessToken: "access-token",
      tokenType: "Bearer",
      expiresAt: "2026-10-15T04:58:05.4315335+00:00",
      user: {
        id: "750d0043-7495-4bdc-9215-ff9780489db9",
        email: payload.email,
        displayName: "Mitchell Rodríguez",
        status: 1,
      },
    }

    requestMock.mockResolvedValue(response)

    await expect(login(payload, controller.signal)).resolves.toEqual(response)

    expect(requestMock).toHaveBeenCalledWith(API_ROUTES.AUTH.LOGIN, {
      method: "POST",
      body: payload,
      credentials: "include",
      signal: controller.signal,
    })
  })
})

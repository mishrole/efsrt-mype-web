import { describe, expect, it, vi } from "vitest"
import type { RequestOptions } from "~/shared/http/client/interfaces"
import { register } from "../../../../services/auth/register"
import { API_ROUTES } from "../../../../shared/constants/api"
import { request } from "../../../../shared/http/client"

vi.mock("../../../../shared/http/client", () => ({
  request: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("register service", () => {
  it("posts the registration contract without cookies and forwards the abort signal", async () => {
    const controller = new AbortController()
    const payload = {
      displayName: "Mitchell Rodríguez",
      email: "correo@gmail.com",
      password: "password1",
      passwordConfirmation: "password1",
    }
    const response = {
      id: "750d0043-7495-4bdc-9215-ff9780489db9",
      displayName: payload.displayName,
      email: payload.email,
    }

    requestMock.mockResolvedValue(response)

    await expect(register(payload, controller.signal)).resolves.toEqual(
      response,
    )

    const options: RequestOptions = {
      method: "POST",
      body: payload,
      signal: controller.signal,
      skipAuthRefresh: true,
    }

    expect(requestMock).toHaveBeenCalledWith(API_ROUTES.AUTH.REGISTER, options)

    expect(requestMock).not.toHaveBeenCalledWith(
      API_ROUTES.AUTH.REGISTER,
      expect.objectContaining({
        credentials: "include",
      }),
    )
  })
})

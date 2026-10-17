import { afterEach, describe, expect, it, vi } from "vitest"
import { apiConfiguration } from "~/shared/configuration/api"
import { configureAuthRefresh, request } from "~/shared/http/client"

const fetchMock = vi.fn<typeof fetch>()

vi.stubGlobal("fetch", fetchMock)

const renewedSession = {
  accessToken: "renewed-access-token",
  tokenType: "Bearer",
  expiresAt: "2026-10-18T10:00:00Z",
  user: {
    id: "user-id",
    email: "user@example.com",
    displayName: "Mitchell",
    status: 1,
  },
}

describe("HTTP client", () => {
  afterEach(() => {
    fetchMock.mockReset()
  })

  it("preserves credentials when sending a request", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ value: "ok" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    )

    await expect(
      request<{ value: string }>("/api/test", {
        method: "POST",
        credentials: "include",
      }),
    ).resolves.toEqual({ value: "ok" })

    const [url, options] = fetchMock.mock.calls[0]

    expect(String(url)).toBe(`${apiConfiguration.baseUrl}/api/test`)
    expect(options?.credentials).toBe("include")
    expect(options?.body).toBeUndefined()
  })

  it("sends a JSON request and returns the deserialized response", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ value: "ok" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    )

    await expect(
      request<{ value: string }>("/api/test", {
        method: "POST",
        body: { input: 10 },
        accessToken: "local-access-token",
      }),
    ).resolves.toEqual({ value: "ok" })

    const [, options] = fetchMock.mock.calls[0]
    const headers = new Headers(options?.headers)

    expect(options?.body).toBe('{"input":10}')
    expect(headers.get("Authorization")).toBe("Bearer local-access-token")
    expect(headers.get("Content-Type")).toBe("application/json")
  })

  it("returns undefined for a successful response without content", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))

    await expect(
      request<void>("/api/test", {
        method: "POST",
        credentials: "include",
      }),
    ).resolves.toBeUndefined()
  })

  it("throws an API error for an unsuccessful JSON response", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          code: "SESSION_UNAVAILABLE",
          message: "La sesión no se encuentra disponible.",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    )

    await expect(
      request("/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include",
      }),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 401,
      code: "SESSION_UNAVAILABLE",
      message: "La sesión no se encuentra disponible.",
    })
  })

  it("throws a controlled API error for an unsuccessful non-JSON response", async () => {
    fetchMock.mockResolvedValue(
      new Response("Internal Server Error", {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      }),
    )

    await expect(request("/api/test")).rejects.toMatchObject({
      name: "ApiError",
      status: 500,
      message: "El servidor devolvió una respuesta no válida.",
    })
  })

  it("refreshes a 401 request, stores the session and retries with the renewed token", async () => {
    const refreshSession = vi.fn().mockResolvedValue(renewedSession)
    const setSession = vi.fn()
    const clearSession = vi.fn()
    configureAuthRefresh({ refreshSession, setSession, clearSession })
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ value: "ok" }), { status: 200 }),
      )

    await expect(
      request<{ value: string }>("/api/private", {
        accessToken: "expired-token",
      }),
    ).resolves.toEqual({ value: "ok" })

    expect(refreshSession).toHaveBeenCalledOnce()
    expect(setSession).toHaveBeenCalledWith(renewedSession)
    expect(clearSession).not.toHaveBeenCalled()
    expect(fetchMock).toHaveBeenCalledTimes(2)

    const retryHeaders = new Headers(fetchMock.mock.calls[1][1]?.headers)
    expect(retryHeaders.get("Authorization")).toBe(
      "Bearer renewed-access-token",
    )
  })

  it("shares one refresh request between concurrent unauthorized responses", async () => {
    let resolveRefresh!: (session: typeof renewedSession) => void
    const refreshSession = vi.fn(
      () =>
        new Promise<typeof renewedSession>((resolve) => {
          resolveRefresh = resolve
        }),
    )
    configureAuthRefresh({
      refreshSession,
      setSession: vi.fn(),
      clearSession: vi.fn(),
    })
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ value: "ok" }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ),
      )

    const firstRequest = request<{ value: string }>("/api/first", {
      accessToken: "expired-token",
    })
    const secondRequest = request<{ value: string }>("/api/second", {
      accessToken: "expired-token",
    })
    await vi.waitFor(() => expect(refreshSession).toHaveBeenCalledOnce())
    resolveRefresh(renewedSession)

    await expect(Promise.all([firstRequest, secondRequest])).resolves.toEqual([
      { value: "ok" },
      { value: "ok" },
    ])
    expect(refreshSession).toHaveBeenCalledOnce()
  })

  it("clears the session and propagates a refresh failure", async () => {
    const refreshError = new Error("Refresh failed")
    const clearSession = vi.fn()
    configureAuthRefresh({
      refreshSession: vi.fn().mockRejectedValue(refreshError),
      setSession: vi.fn(),
      clearSession,
    })
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }))

    await expect(
      request("/api/private", { accessToken: "expired-token" }),
    ).rejects.toBe(refreshError)
    expect(clearSession).toHaveBeenCalledOnce()
  })

  it("does not refresh when the request explicitly skips automatic refresh", async () => {
    const refreshSession = vi.fn()
    configureAuthRefresh({
      refreshSession,
      setSession: vi.fn(),
      clearSession: vi.fn(),
    })
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      }),
    )

    await expect(
      request("/api/private", {
        accessToken: "expired-token",
        skipAuthRefresh: true,
      }),
    ).rejects.toMatchObject({ status: 401 })
    expect(refreshSession).not.toHaveBeenCalled()
  })
})

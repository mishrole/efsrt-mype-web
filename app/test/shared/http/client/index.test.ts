import { afterEach, describe, expect, it, vi } from "vitest"
import { apiConfiguration } from "~/shared/configuration/api"
import { request } from "../../../../shared/http/client"

const fetchMock = vi.fn<typeof fetch>()

vi.stubGlobal("fetch", fetchMock)

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
})

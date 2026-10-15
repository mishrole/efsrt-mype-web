import { afterEach, describe, expect, it, vi } from "vitest"

describe("API configuration", () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("uses VITE_API_BASE_URL when it has a value", async () => {
    vi.stubEnv("VITE_API_BASE_URL", " https://api.example.test ")
    vi.resetModules()

    const { apiConfiguration } =
      await import("../../../../shared/configuration/api")

    expect(apiConfiguration.baseUrl).toBe("https://api.example.test")
  })

  it("uses the local URL when VITE_API_BASE_URL is empty", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "   ")
    vi.resetModules()

    const { apiConfiguration } =
      await import("../../../../shared/configuration/api")

    expect(apiConfiguration.baseUrl).toBe("http://localhost:5010")
  })
})

import { describe, expect, it } from "vitest"
import App, { ErrorBoundary, Layout, links } from "~/root"

describe("root", () => {
  it("returns links", () => {
    const result = links()

    expect(result).toHaveLength(3)
    expect(result.some((link) => "href" in link)).toBe(true)
  })

  it("renders layout", () => {
    const result = Layout({
      children: "test",
    })

    expect(result).toBeDefined()
  })

  it("handles generic errors", () => {
    const result = ErrorBoundary({
      error: new Error("boom"),
      params: {},
    })

    expect(result).toBeDefined()
  })

  it("handles 404 route errors", () => {
    const result = ErrorBoundary({
      error: {
        status: 404,
        statusText: "Not Found",
        data: null,
        internal: false,
      },
      params: {},
    })

    expect(result).toBeDefined()
  })

  it("handles non-404 route errors", () => {
    const result = ErrorBoundary({
      error: {
        status: 500,
        statusText: "Internal Server Error",
        data: null,
        internal: false,
      },
      params: {},
    })

    expect(result).toBeDefined()
  })

  it("returns app component", () => {
    expect(App()).toBeDefined()
  })
})

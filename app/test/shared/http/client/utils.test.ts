import { describe, expect, it } from "vitest"
import {
  createHeaders,
  serializeBody,
} from "../../../../shared/http/client/utils"

describe("HTTP client utilities", () => {
  it("creates the default JSON headers", () => {
    const headers = createHeaders()

    expect(headers.get("Accept")).toBe("application/json")
    expect(headers.get("Content-Type")).toBe("application/json")
    expect(headers.has("Authorization")).toBe(false)
  })

  it("preserves a custom content type and existing headers", () => {
    const headers = createHeaders({
      "Content-Type": "application/problem+json",
      "X-Correlation-Id": "correlation-id",
    })

    expect(headers.get("Content-Type")).toBe("application/problem+json")
    expect(headers.get("X-Correlation-Id")).toBe("correlation-id")
  })

  it("adds bearer authentication when an access token is provided", () => {
    const headers = createHeaders(undefined, "local-access-token")

    expect(headers.get("Authorization")).toBe("Bearer local-access-token")
  })

  it("serializes a defined body", () => {
    expect(serializeBody({ name: "Mype" })).toBe('{"name":"Mype"}')
  })

  it("does not create a request body for undefined", () => {
    expect(serializeBody(undefined)).toBeUndefined()
  })
})

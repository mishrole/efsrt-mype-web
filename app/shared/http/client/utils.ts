export function createHeaders(
  headers?: HeadersInit,
  accessToken?: string,
  body?: unknown,
): Headers {
  const result = new Headers(headers)
  result.set("Accept", "application/json")

  if (!(body instanceof FormData) && !result.has("Content-Type")) {
    result.set("Content-Type", "application/json")
  }

  if (accessToken) {
    result.set("Authorization", `Bearer ${accessToken}`)
  }

  return result
}

export function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined) {
    return undefined
  }

  if (body instanceof FormData) {
    return body
  }

  return JSON.stringify(body)
}

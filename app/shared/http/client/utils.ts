export function createHeaders(
  headers?: HeadersInit,
  accessToken?: string,
): Headers {
  const result = new Headers(headers)
  result.set("Accept", "application/json")

  if (!result.has("Content-Type")) {
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

  return JSON.stringify(body)
}

import { apiConfiguration } from "../../configuration/api"
import { createApiError, readApiErrorPayload } from "../errors"
import type { RequestOptions } from "./interfaces"
import { createHeaders, serializeBody } from "./utils"

export async function request<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(`${apiConfiguration.baseUrl}${path}`, {
    ...options,
    body: serializeBody(options.body),
    headers: createHeaders(options.headers, options.accessToken),
  })

  if (!response.ok) {
    throw createApiError(response.status, await readApiErrorPayload(response))
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}

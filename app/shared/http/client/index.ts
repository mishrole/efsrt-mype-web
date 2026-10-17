import { apiConfiguration } from "../../configuration/api"
import { createApiError, readApiErrorPayload } from "../errors"
import type { AuthRefreshConfiguration, RequestOptions } from "./interfaces"
import { createHeaders, serializeBody } from "./utils"

let authRefreshConfiguration: AuthRefreshConfiguration | null = null
let refreshRequest: Promise<string> | null = null

export function configureAuthRefresh(
  configuration: AuthRefreshConfiguration,
): void {
  authRefreshConfiguration = configuration
}

export async function request<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const response = await sendRequest(path, options)

  if (shouldRefreshSession(response, options)) {
    const accessToken = await refreshAccessToken()

    return retryRequest<TResponse>(path, options, accessToken)
  }

  return readResponse<TResponse>(response)
}

async function sendRequest(
  path: string,
  options: RequestOptions,
): Promise<Response> {
  return fetch(`${apiConfiguration.baseUrl}${path}`, {
    method: options.method,
    body: serializeBody(options.body),
    cache: options.cache,
    credentials: options.credentials,
    headers: createHeaders(options.headers, options.accessToken),
    integrity: options.integrity,
    keepalive: options.keepalive,
    mode: options.mode,
    priority: options.priority,
    redirect: options.redirect,
    referrer: options.referrer,
    referrerPolicy: options.referrerPolicy,
    signal: options.signal,
  })
}

function shouldRefreshSession(
  response: Response,
  options: RequestOptions,
): boolean {
  return (
    response.status === 401 &&
    Boolean(options.accessToken) &&
    options.skipAuthRefresh !== true &&
    authRefreshConfiguration !== null
  )
}

async function refreshAccessToken(): Promise<string> {
  if (!authRefreshConfiguration) {
    throw new Error("La renovación automática de sesión no está configurada.")
  }

  refreshRequest ??= executeRefresh(authRefreshConfiguration)

  try {
    return await refreshRequest
  } finally {
    refreshRequest = null
  }
}

async function executeRefresh(
  configuration: AuthRefreshConfiguration,
): Promise<string> {
  try {
    const session = await configuration.refreshSession()

    configuration.setSession(session)

    return session.accessToken
  } catch (error) {
    configuration.clearSession()
    throw error
  }
}

async function retryRequest<TResponse>(
  path: string,
  options: RequestOptions,
  accessToken: string,
): Promise<TResponse> {
  const response = await sendRequest(path, {
    ...options,
    accessToken,
    skipAuthRefresh: true,
  })

  return readResponse<TResponse>(response)
}

async function readResponse<TResponse>(response: Response): Promise<TResponse> {
  if (!response.ok) {
    throw createApiError(response.status, await readApiErrorPayload(response))
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}

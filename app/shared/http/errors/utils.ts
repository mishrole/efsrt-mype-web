import type { ApiError, ApiErrorPayload } from "./interfaces"

const DEFAULT_ERROR_MESSAGE = "No fue posible completar la solicitud."

export function createApiError(
  status: number,
  payload: ApiErrorPayload,
): ApiError {
  return Object.assign(new Error(payload.message || DEFAULT_ERROR_MESSAGE), {
    name: "ApiError",
    status,
    code: payload.code,
    errors: payload.errors,
  })
}

export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof Error &&
    "status" in error &&
    typeof error.status === "number"
  )
}

export async function readApiErrorPayload(
  response: Response,
): Promise<ApiErrorPayload> {
  try {
    return (await response.json()) as ApiErrorPayload
  } catch {
    return { message: "El servidor devolvió una respuesta no válida." }
  }
}

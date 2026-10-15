export interface ApiErrorPayload {
  code?: string
  message?: string
  errors?: Record<string, string[]>
}

export interface ApiError extends Error {
  status: number
  code?: string
  errors?: Record<string, string[]>
}

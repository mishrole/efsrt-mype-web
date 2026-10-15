import type { ApiConfiguration } from "./interfaces"

const DEFAULT_API_BASE_URL = "http://localhost:5010"

export const apiConfiguration: ApiConfiguration = {
  baseUrl: import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL,
}

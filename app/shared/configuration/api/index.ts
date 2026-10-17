import type { ApiConfiguration } from "./interfaces"

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim()

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured")
}

export const apiConfiguration: ApiConfiguration = {
  baseUrl: BASE_URL,
}

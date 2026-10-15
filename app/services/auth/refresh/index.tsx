import { API_ROUTES } from "~/shared/constants/api"
import { request } from "../../../shared/http/client"
import type { RefreshSessionResponse } from "./interfaces"

export function refreshSession(
  signal?: AbortSignal,
): Promise<RefreshSessionResponse> {
  return request<RefreshSessionResponse>(API_ROUTES.AUTH.REFRESH, {
    method: "POST",
    credentials: "include",
    signal,
  })
}

import { API_ROUTES } from "~/shared/constants/api"
import type { RequestOptions } from "~/shared/http/client/interfaces"
import { request } from "../../../shared/http/client"
import type { RefreshSessionResponse } from "./interfaces"

export function refreshSession(
  signal?: AbortSignal,
): Promise<RefreshSessionResponse> {
  const options: RequestOptions = {
    method: "POST",
    credentials: "include",
    signal,
    skipAuthRefresh: true,
  }

  return request<RefreshSessionResponse>(API_ROUTES.AUTH.REFRESH, options)
}

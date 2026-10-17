import { API_ROUTES } from "~/shared/constants/api"
import type { RequestOptions } from "~/shared/http/client/interfaces"
import { request } from "../../../shared/http/client"

export function logout(signal?: AbortSignal): Promise<void> {
  const options: RequestOptions = {
    method: "POST",
    credentials: "include",
    signal,
    skipAuthRefresh: true,
  }

  return request<void>(API_ROUTES.AUTH.LOGOUT, options)
}

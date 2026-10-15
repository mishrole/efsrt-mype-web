import { API_ROUTES } from "~/shared/constants/api"
import { request } from "../../../shared/http/client"

export function logout(signal?: AbortSignal): Promise<void> {
  return request<void>(API_ROUTES.AUTH.LOGOUT, {
    method: "POST",
    credentials: "include",
    signal,
  })
}

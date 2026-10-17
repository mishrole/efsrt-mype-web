import { API_ROUTES } from "~/shared/constants/api"
import type { RequestOptions } from "~/shared/http/client/interfaces"
import { request } from "../../../shared/http/client"
import type { LoginRequest, LoginResponse } from "./interfaces"

export function login(
  payload: LoginRequest,
  signal?: AbortSignal,
): Promise<LoginResponse> {
  const options: RequestOptions = {
    method: "POST",
    body: payload,
    credentials: "include",
    signal,
    skipAuthRefresh: true,
  }

  return request<LoginResponse>(API_ROUTES.AUTH.LOGIN, options)
}

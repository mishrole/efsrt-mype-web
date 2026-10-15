import { API_ROUTES } from "~/shared/constants/api"
import { request } from "../../../shared/http/client"
import type { LoginRequest, LoginResponse } from "./interfaces"

export function login(
  payload: LoginRequest,
  signal?: AbortSignal,
): Promise<LoginResponse> {
  return request<LoginResponse>(API_ROUTES.AUTH.LOGIN, {
    method: "POST",
    body: payload,
    credentials: "include",
    signal,
  })
}

import { API_ROUTES } from "~/shared/constants/api"
import { request } from "../../../shared/http/client"
import type { RegisterRequest, RegisterResponse } from "./interfaces"

export function register(
  payload: RegisterRequest,
  signal?: AbortSignal,
): Promise<RegisterResponse> {
  return request<RegisterResponse>(API_ROUTES.AUTH.REGISTER, {
    method: "POST",
    body: payload,
    signal,
  })
}

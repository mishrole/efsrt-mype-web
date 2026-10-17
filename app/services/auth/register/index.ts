import { API_ROUTES } from "~/shared/constants/api"
import type { RequestOptions } from "~/shared/http/client/interfaces"
import { request } from "../../../shared/http/client"
import type { RegisterRequest, RegisterResponse } from "./interfaces"

export function register(
  payload: RegisterRequest,
  signal?: AbortSignal,
): Promise<RegisterResponse> {
  const options: RequestOptions = {
    method: "POST",
    body: payload,
    signal,
    skipAuthRefresh: true,
  }

  return request<RegisterResponse>(API_ROUTES.AUTH.REGISTER, options)
}

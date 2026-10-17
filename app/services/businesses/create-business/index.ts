import { API_ROUTES } from "~/shared/constants/api"
import { request } from "../../../shared/http/client"
import type {
  CreateBusinessRequest,
  CreateBusinessResponse,
} from "./interfaces"

export function createBusiness(
  payload: CreateBusinessRequest,
  accessToken: string,
  signal?: AbortSignal,
): Promise<CreateBusinessResponse> {
  return request<CreateBusinessResponse>(API_ROUTES.BUSINESSES, {
    method: "POST",
    body: payload,
    accessToken,
    signal,
  })
}

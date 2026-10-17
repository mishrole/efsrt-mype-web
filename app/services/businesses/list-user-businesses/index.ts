import { API_ROUTES } from "~/shared/constants/api"
import { request } from "../../../shared/http/client"
import type { BusinessSummary } from "./interfaces"

export function listUserBusinesses(
  accessToken: string,
  signal?: AbortSignal,
): Promise<BusinessSummary[]> {
  return request<BusinessSummary[]>(API_ROUTES.BUSINESSES, {
    method: "GET",
    accessToken,
    signal,
  })
}

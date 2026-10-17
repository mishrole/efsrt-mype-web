import { API_ROUTES } from "~/shared/constants/api"
import { request } from "../../../shared/http/client"
import type { BusinessContext } from "./interfaces"

export function getBusinessContext(
  businessId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<BusinessContext> {
  return request<BusinessContext>(API_ROUTES.BUSINESS_CONTEXT(businessId), {
    method: "GET",
    accessToken,
    signal,
  })
}

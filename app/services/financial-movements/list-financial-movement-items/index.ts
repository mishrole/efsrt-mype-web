import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type { ListFinancialMovementItemsResponse } from "./interfaces"

export function listFinancialMovementItems(
  businessId: string,
  movementId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<ListFinancialMovementItemsResponse> {
  return request<ListFinancialMovementItemsResponse>(
    API_ROUTES.FINANCIAL_MOVEMENT_ITEMS(businessId, movementId),
    { method: "GET", accessToken, signal },
  )
}

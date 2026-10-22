import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type { FinancialMovementHistoryDetailResponse } from "./interfaces"

export function getFinancialMovementHistoryDetail(
  businessId: string,
  movementId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<FinancialMovementHistoryDetailResponse> {
  return request<FinancialMovementHistoryDetailResponse>(
    API_ROUTES.FINANCIAL_MOVEMENT_HISTORY_DETAIL(businessId, movementId),
    {
      method: "GET",
      accessToken,
      signal,
    },
  )
}

import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type { FinancialMovementDraftResponse } from "../interfaces"

export function getFinancialMovementDraft(
  businessId: string,
  movementId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<FinancialMovementDraftResponse> {
  return request<FinancialMovementDraftResponse>(
    API_ROUTES.FINANCIAL_MOVEMENT_DETAIL(businessId, movementId),
    {
      method: "GET",
      accessToken,
      signal,
    },
  )
}

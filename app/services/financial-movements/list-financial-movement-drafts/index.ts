import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type { FinancialMovementDraftListItemResponse } from "../interfaces"

export function listFinancialMovementDrafts(
  businessId: string,
  accessToken: string,
  signal?: AbortSignal,
): Promise<FinancialMovementDraftListItemResponse[]> {
  return request<FinancialMovementDraftListItemResponse[]>(
    API_ROUTES.FINANCIAL_MOVEMENTS(businessId),
    {
      method: "GET",
      accessToken,
      signal,
    },
  )
}

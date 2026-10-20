import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  CreateFinancialMovementDraftRequest,
  FinancialMovementDraftResponse,
} from "../interfaces"

export function createFinancialMovementDraft(
  businessId: string,
  payload: CreateFinancialMovementDraftRequest,
  accessToken: string,
): Promise<FinancialMovementDraftResponse> {
  return request<FinancialMovementDraftResponse>(
    API_ROUTES.FINANCIAL_MOVEMENTS(businessId),
    {
      method: "POST",
      body: payload,
      accessToken,
    },
  )
}

import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  FinancialMovementDraftResponse,
  UpdateFinancialMovementDraftRequest,
} from "../interfaces"

export function updateFinancialMovementDraft(
  businessId: string,
  movementId: string,
  payload: UpdateFinancialMovementDraftRequest,
  accessToken: string,
): Promise<FinancialMovementDraftResponse> {
  return request<FinancialMovementDraftResponse>(
    API_ROUTES.FINANCIAL_MOVEMENT_DETAIL(businessId, movementId),
    {
      method: "PUT",
      body: payload,
      accessToken,
    },
  )
}

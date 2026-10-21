import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  ConfirmFinancialMovementRequest,
  ConfirmFinancialMovementResponse,
} from "./interfaces"

export function confirmFinancialMovement(
  businessId: string,
  movementId: string,
  payload: ConfirmFinancialMovementRequest,
  accessToken: string,
): Promise<ConfirmFinancialMovementResponse> {
  return request<ConfirmFinancialMovementResponse>(
    API_ROUTES.FINANCIAL_MOVEMENT_CONFIRM(businessId, movementId),
    {
      method: "POST",
      body: payload,
      accessToken,
    },
  )
}

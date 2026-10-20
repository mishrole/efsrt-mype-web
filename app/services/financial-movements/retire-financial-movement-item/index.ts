import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  RetireFinancialMovementItemRequest,
  RetireFinancialMovementItemResponse,
} from "./interfaces"

export function retireFinancialMovementItem(
  businessId: string,
  movementId: string,
  itemId: string,
  payload: RetireFinancialMovementItemRequest,
  accessToken: string,
): Promise<RetireFinancialMovementItemResponse> {
  return request<RetireFinancialMovementItemResponse>(
    API_ROUTES.FINANCIAL_MOVEMENT_ITEM_RETIRE(businessId, movementId, itemId),
    {
      method: "PATCH",
      body: payload,
      accessToken,
    },
  )
}

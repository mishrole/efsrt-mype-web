import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  UpdateExpenseItemRequest,
  UpdateExpenseItemResponse,
} from "./interfaces"

export function updateExpenseItem(
  businessId: string,
  movementId: string,
  itemId: string,
  payload: UpdateExpenseItemRequest,
  accessToken: string,
): Promise<UpdateExpenseItemResponse> {
  return request<UpdateExpenseItemResponse>(
    API_ROUTES.EXPENSE_ITEM_DETAIL(businessId, movementId, itemId),
    {
      method: "PUT",
      body: payload,
      accessToken,
    },
  )
}

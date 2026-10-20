import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  AddExpenseItemRequest,
  AddExpenseItemResponse,
} from "./interfaces"

export function addExpenseItem(
  businessId: string,
  movementId: string,
  payload: AddExpenseItemRequest,
  accessToken: string,
): Promise<AddExpenseItemResponse> {
  return request<AddExpenseItemResponse>(
    API_ROUTES.EXPENSE_ITEMS(businessId, movementId),
    {
      method: "POST",
      body: payload,
      accessToken,
    },
  )
}

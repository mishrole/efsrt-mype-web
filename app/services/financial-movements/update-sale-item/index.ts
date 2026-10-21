import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  UpdateSaleItemRequest,
  UpdateSaleItemResponse,
} from "./interfaces"

export function updateSaleItem(
  businessId: string,
  movementId: string,
  itemId: string,
  payload: UpdateSaleItemRequest,
  accessToken: string,
): Promise<UpdateSaleItemResponse> {
  return request<UpdateSaleItemResponse>(
    API_ROUTES.SALE_ITEM_DETAIL(businessId, movementId, itemId),
    {
      method: "PUT",
      body: payload,
      accessToken,
    },
  )
}

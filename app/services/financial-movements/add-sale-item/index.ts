import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type { AddSaleItemRequest, AddSaleItemResponse } from "./interfaces"

export function addSaleItem(
  businessId: string,
  movementId: string,
  payload: AddSaleItemRequest,
  accessToken: string,
): Promise<AddSaleItemResponse> {
  return request<AddSaleItemResponse>(
    API_ROUTES.SALE_ITEMS(businessId, movementId),
    {
      method: "POST",
      body: payload,
      accessToken,
    },
  )
}

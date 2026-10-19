import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  ProductMaintenanceResponse,
  UpdateProductRequest,
} from "./interfaces"
export function updateProduct(
  businessId: string,
  productId: string,
  payload: UpdateProductRequest,
  accessToken: string,
) {
  return request<ProductMaintenanceResponse>(
    API_ROUTES.PRODUCT_DETAIL(businessId, productId),
    { method: "PUT", body: payload, accessToken },
  )
}

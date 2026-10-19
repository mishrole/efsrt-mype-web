import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  GetProductDetailRequest,
  ProductDetailResponse,
} from "./interfaces"

export function getProductDetail(
  parameters: GetProductDetailRequest,
  accessToken: string,
  signal?: AbortSignal,
): Promise<ProductDetailResponse> {
  return request<ProductDetailResponse>(
    API_ROUTES.PRODUCT_DETAIL(parameters.businessId, parameters.productId),
    {
      method: "GET",
      accessToken,
      signal,
    },
  )
}

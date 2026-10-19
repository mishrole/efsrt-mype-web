import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type { ListProductsRequest, ProductListItemResponse } from "./interfaces"
import { createProductsQuery } from "./utils"

export function listProducts(
  filters: ListProductsRequest,
  accessToken: string,
  signal?: AbortSignal,
): Promise<ProductListItemResponse[]> {
  const { businessId, ...queryFilters } = filters
  const query = createProductsQuery(queryFilters)

  return request<ProductListItemResponse[]>(
    `${API_ROUTES.PRODUCTS(businessId)}${query}`,
    {
      method: "GET",
      accessToken,
      signal,
    },
  )
}

import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  CategoryListItemResponse,
  ListCategoriesRequest,
} from "./interfaces"
import { createCategoriesQuery } from "./utils"

export function listCategories(
  filters: ListCategoriesRequest,
  accessToken: string,
  signal?: AbortSignal,
): Promise<CategoryListItemResponse[]> {
  const { businessId, ...queryFilters } = filters
  const query = createCategoriesQuery(queryFilters)

  return request<CategoryListItemResponse[]>(
    `${API_ROUTES.CATEGORIES(businessId)}${query}`,
    {
      method: "GET",
      accessToken,
      signal,
    },
  )
}

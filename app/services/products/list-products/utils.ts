import type { ListProductsRequest } from "./interfaces"

export function createProductsQuery(
  filters: Omit<ListProductsRequest, "businessId">,
): string {
  const query = new URLSearchParams()
  const search = filters.search?.trim()

  if (search) {
    query.set("search", search)
  }

  if (filters.categoryId) {
    query.set("categoryId", filters.categoryId)
  }

  if (filters.productCategoryId) {
    query.set("productCategoryId", filters.productCategoryId)
  }

  if (filters.isActive !== undefined) {
    query.set("isActive", String(filters.isActive))
  }

  if (filters.availableForSale !== undefined) {
    query.set("availableForSale", String(filters.availableForSale))
  }

  const value = query.toString()
  return value ? `?${value}` : ""
}

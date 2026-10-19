import type { ListCategoriesRequest } from "./interfaces"

export function createCategoriesQuery(
  filters: Omit<ListCategoriesRequest, "businessId">,
): string {
  const query = new URLSearchParams()

  if (filters.type !== undefined) {
    query.set("type", String(filters.type))
  }

  if (filters.isActive !== undefined) {
    query.set("isActive", String(filters.isActive))
  }

  const value = query.toString()
  return value ? `?${value}` : ""
}

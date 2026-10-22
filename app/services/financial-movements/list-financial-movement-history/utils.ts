import type { ListFinancialMovementHistoryRequest } from "./interfaces"

export function createFinancialMovementHistoryQuery(
  filters: Omit<ListFinancialMovementHistoryRequest, "businessId">,
): string {
  const query = new URLSearchParams()

  if (filters.type !== undefined) {
    query.set("type", String(filters.type))
  }

  if (filters.status !== undefined) {
    query.set("status", String(filters.status))
  }

  if (filters.dateFrom) {
    query.set("dateFrom", filters.dateFrom)
  }

  if (filters.dateTo) {
    query.set("dateTo", filters.dateTo)
  }

  if (filters.categoryId) {
    query.set("categoryId", filters.categoryId)
  }

  if (filters.page !== undefined) {
    query.set("page", String(filters.page))
  }

  if (filters.pageSize !== undefined) {
    query.set("pageSize", String(filters.pageSize))
  }

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ""
}

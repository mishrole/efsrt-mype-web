import type { GetFinancialDashboardRequest } from "./interfaces"

export function createFinancialDashboardQuery(
  filters: Omit<GetFinancialDashboardRequest, "businessId">,
): string {
  const query = new URLSearchParams()

  if (filters.dateFrom) query.set("dateFrom", filters.dateFrom)
  if (filters.dateTo) query.set("dateTo", filters.dateTo)
  if (filters.granularity !== undefined) {
    query.set("granularity", String(filters.granularity))
  }

  const value = query.toString()
  return value ? `?${value}` : ""
}

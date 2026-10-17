import { API_ROUTES } from "~/shared/constants/api"
import { request } from "../../../shared/http/client"
import type {
  FinancialDashboardResponse,
  GetFinancialDashboardRequest,
} from "./interfaces"
import { createFinancialDashboardQuery } from "./utils"

export function getFinancialDashboard(
  filters: GetFinancialDashboardRequest,
  accessToken: string,
  signal?: AbortSignal,
): Promise<FinancialDashboardResponse> {
  const { businessId, ...queryFilters } = filters
  const query = createFinancialDashboardQuery(queryFilters)

  return request<FinancialDashboardResponse>(
    `${API_ROUTES.FINANCIAL_DASHBOARD(businessId)}${query}`,
    { method: "GET", accessToken, signal },
  )
}

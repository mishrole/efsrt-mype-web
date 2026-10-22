import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import type {
  FinancialMovementHistoryPageResponse,
  ListFinancialMovementHistoryRequest,
} from "./interfaces"
import { createFinancialMovementHistoryQuery } from "./utils"

export function listFinancialMovementHistory(
  filters: ListFinancialMovementHistoryRequest,
  accessToken: string,
  signal?: AbortSignal,
): Promise<FinancialMovementHistoryPageResponse> {
  const { businessId, ...historyFilters } = filters
  const query = createFinancialMovementHistoryQuery(historyFilters)

  return request<FinancialMovementHistoryPageResponse>(
    `${API_ROUTES.FINANCIAL_MOVEMENT_HISTORY(businessId)}${query}`,
    {
      method: "GET",
      accessToken,
      signal,
    },
  )
}

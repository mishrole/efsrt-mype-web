import type { BusinessSummary } from "~/services/businesses/list-user-businesses/interfaces"
import type {
  FinancialDashboardGranularity,
  FinancialDashboardResponse,
} from "~/services/financial-dashboard/get-financial-dashboard/interfaces"

export interface DashboardFilters {
  dateFrom: string
  dateTo: string
  granularity: FinancialDashboardGranularity
}
export interface UseDashboardResult {
  businesses: BusinessSummary[]
  currentBusinessId: string
  dashboard: FinancialDashboardResponse | null
  filters: DashboardFilters
  isLoading: boolean
  error: string
  needsOnboarding: boolean
  selectBusiness: (id: string) => void
  setFilters: (filters: DashboardFilters) => void
  reloadAfterCreation: (businessId: string) => Promise<void>
  logoutCurrentSession: () => Promise<void>
}

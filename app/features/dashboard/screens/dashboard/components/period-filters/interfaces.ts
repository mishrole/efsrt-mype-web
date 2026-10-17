import type { FinancialDashboardGranularity } from "../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"

export interface PeriodFilterValues {
  dateFrom: string
  dateTo: string
  granularity: FinancialDashboardGranularity
}

export interface PeriodFiltersProps {
  values: PeriodFilterValues
  onChange: (values: PeriodFilterValues) => void
}

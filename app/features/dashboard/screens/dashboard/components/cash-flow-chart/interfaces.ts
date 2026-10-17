import type { FinancialTrendPoint } from "../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"

export interface CashFlowChartProps {
  trend: FinancialTrendPoint[]
  currencyCode: string
}

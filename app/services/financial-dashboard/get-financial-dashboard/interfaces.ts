export enum FinancialDashboardGranularity {
  Auto = 0,
  Day = 1,
  Week = 2,
  Month = 3,
  Year = 4,
}

export interface GetFinancialDashboardRequest {
  businessId: string
  dateFrom?: string
  dateTo?: string
  granularity?: FinancialDashboardGranularity
}

export interface FinancialTrendPoint {
  dateFrom: string
  dateTo: string
  cashInflow: number
  cashOutflow: number
  netCashFlow: number
  closingBalance: number
}

export interface CategoryAmount {
  categoryId: string
  categoryName: string
  categoryIsActive: boolean
  amount: number
  percentage: number
}

export interface FinancialDashboardResponse {
  businessId: string
  currencyCode: string
  dateFrom: string
  dateTo: string
  granularity: FinancialDashboardGranularity
  openingBalance: number
  cashInflow: number
  cashOutflow: number
  netCashFlow: number
  closingBalance: number
  estimatedCost: number
  estimatedGrossMargin: number
  confirmedSaleCount: number
  confirmedExpenseCount: number
  averageSaleAmount: number
  trend: FinancialTrendPoint[]
  saleByCategory: CategoryAmount[]
  expenseByCategory: CategoryAmount[]
}

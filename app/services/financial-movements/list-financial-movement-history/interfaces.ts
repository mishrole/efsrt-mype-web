import type { FinancialMovementType } from "~/features/financial-movements/constants"

export enum FinancialMovementStatus {
  Draft = 1,
  Confirmed = 2,
  Cancelled = 3,
  Discarded = 4,
}

export interface ListFinancialMovementHistoryRequest {
  businessId: string
  type?: FinancialMovementType
  status?: FinancialMovementStatus
  dateFrom?: string
  dateTo?: string
  categoryId?: string
  page?: number
  pageSize?: number
}

export interface FinancialMovementHistoryListItemResponse {
  id: string
  type: FinancialMovementType
  status: FinancialMovementStatus
  movementDate: string
  description: string | null
  currencyCode: string
  totalAmount: number
  activeItemCount: number
  hasActiveEvidence: boolean
  confirmedAt: string | null
  cancelledAt: string | null
  discardedAt: string | null
}

export interface FinancialMovementHistoryPageResponse {
  items: FinancialMovementHistoryListItemResponse[]
  page: number
  pageSize: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

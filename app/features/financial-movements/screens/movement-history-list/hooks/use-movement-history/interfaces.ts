import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import type { FinancialMovementType } from "~/features/financial-movements/constants"
import type {
  FinancialMovementHistoryListItemResponse,
  FinancialMovementHistoryPageResponse,
  FinancialMovementStatus,
} from "~/services/financial-movements/list-financial-movement-history/interfaces"

export interface MovementHistoryFilters {
  type?: FinancialMovementType
  status?: FinancialMovementStatus
  dateFrom: string
  dateTo: string
  categoryId: string
}

export interface UseMovementHistoryResult {
  movements: FinancialMovementHistoryListItemResponse[]
  categories: CategoryListItemResponse[]
  filters: MovementHistoryFilters
  page: number
  pageSize: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  isLoading: boolean
  error: string
  setFilters: (filters: MovementHistoryFilters) => void
  applyFilters: () => void
  clearFilters: () => void
  goToPreviousPage: () => void
  goToNextPage: () => void
  viewMovement: (movementId: string) => void
  viewDrafts: () => void
  returnToDashboard: () => void
}

export const EMPTY_MOVEMENT_HISTORY_PAGE: FinancialMovementHistoryPageResponse =
  {
    items: [],
    page: 1,
    pageSize: 20,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  }

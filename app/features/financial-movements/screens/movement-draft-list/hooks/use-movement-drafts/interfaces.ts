import type { FinancialMovementDraftListItemResponse } from "~/services/financial-movements/interfaces"

export interface UseMovementDraftsResult {
  movements: FinancialMovementDraftListItemResponse[]
  canCreate: boolean
  isLoading: boolean
  error: string
  createSale: () => void
  createExpense: () => void
  viewMovement: (movementId: string) => void
  returnToDashboard: () => void
}

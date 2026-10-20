import type { FinancialMovementFormValues } from "~/features/financial-movements/components/financial-movement-form/schema"
import type { FinancialMovementDraftResponse } from "~/services/financial-movements/interfaces"

export interface UseMovementDraftDetailResult {
  movement: FinancialMovementDraftResponse | null
  canUpdate: boolean
  isLoading: boolean
  isSubmitting: boolean
  error: string
  submitMovement: (values: FinancialMovementFormValues) => Promise<void>
  returnToMovements: () => void
  reloadMovement: () => Promise<void>
  applyMovementSummary: (movementTotal: number, movementVersion: number) => void
}

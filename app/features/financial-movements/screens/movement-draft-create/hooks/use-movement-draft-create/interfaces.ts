import type { FinancialMovementType } from "~/features/financial-movements/constants"
import type { FinancialMovementFormValues } from "~/features/financial-movements/components/financial-movement-form/schema"

export interface UseMovementDraftCreateResult {
  type: FinancialMovementType | null
  isSubmitting: boolean
  error: string
  submitMovement: (values: FinancialMovementFormValues) => Promise<void>
  returnToMovements: () => void
}

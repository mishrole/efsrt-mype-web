import type { FinancialMovementFormValues } from "~/features/financial-movements/components/financial-movement-form/schema"
import type { ConfirmFinancialMovementItemVersion } from "~/services/financial-movements/confirm-financial-movement/interfaces"
import type { FinancialMovementDraftResponse } from "~/services/financial-movements/interfaces"

export interface UseMovementDraftDetailResult {
  movement: FinancialMovementDraftResponse | null
  itemVersions: ConfirmFinancialMovementItemVersion[]
  canUpdate: boolean
  canConfirm: boolean
  isLoading: boolean
  isSubmitting: boolean
  isConfirming: boolean
  isConfirmDialogOpen: boolean
  error: string
  submitMovement: (values: FinancialMovementFormValues) => Promise<void>
  returnToMovements: () => void
  reloadMovement: () => Promise<void>
  applyMovementSummary: (movementTotal: number, movementVersion: number) => void
  applyMovementItems: (items: ConfirmFinancialMovementItemVersion[]) => void
  openConfirmDialog: () => void
  closeConfirmDialog: () => void
  confirmMovement: () => Promise<void>
}

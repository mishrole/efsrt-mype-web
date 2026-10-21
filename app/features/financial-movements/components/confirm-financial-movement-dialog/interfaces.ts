import type { FinancialMovementType } from "~/features/financial-movements/constants"

export interface ConfirmFinancialMovementDialogProps {
  isOpen: boolean
  isConfirming: boolean
  movementType: FinancialMovementType
  movementDate: string
  totalAmount: number
  currencyCode: string
  itemCount: number
  onCancel: () => void
  onConfirm: () => Promise<void>
}

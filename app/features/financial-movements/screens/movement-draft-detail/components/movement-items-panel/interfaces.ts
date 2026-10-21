import type { FinancialMovementType } from "~/features/financial-movements/constants"
export interface MovementItemsPanelProps {
  businessId: string
  movementId: string
  movementType: FinancialMovementType
  movementVersion: number
  currencyCode: string
  onMovementChanged: (movementTotal: number, movementVersion: number) => void
}

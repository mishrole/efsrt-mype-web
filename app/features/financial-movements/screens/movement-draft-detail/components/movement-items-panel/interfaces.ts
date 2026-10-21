import type { FinancialMovementType } from "~/features/financial-movements/constants"
import type { ConfirmFinancialMovementItemVersion } from "~/services/financial-movements/confirm-financial-movement/interfaces"

export interface MovementItemsPanelProps {
  businessId: string
  movementId: string
  movementType: FinancialMovementType
  movementVersion: number
  currencyCode: string
  onMovementChanged: (movementTotal: number, movementVersion: number) => void
  onItemsChanged: (items: ConfirmFinancialMovementItemVersion[]) => void
  showHeading?: boolean
}

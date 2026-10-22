import type { FinancialMovementHistoryListItemResponse } from "~/services/financial-movements/list-financial-movement-history/interfaces"

export interface MovementHistoryCardProps {
  movement: FinancialMovementHistoryListItemResponse
  onView: (movementId: string) => void
}

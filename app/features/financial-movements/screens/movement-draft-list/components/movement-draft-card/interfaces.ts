import type { FinancialMovementDraftListItemResponse } from "~/services/financial-movements/interfaces"

export interface MovementDraftCardProps {
  movement: FinancialMovementDraftListItemResponse
  onView: (movementId: string) => void
}

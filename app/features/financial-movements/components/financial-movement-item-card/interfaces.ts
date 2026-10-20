import type { FinancialMovementItemResponse } from "~/services/financial-movements/interfaces"

export interface FinancialMovementItemCardProps {
  item: FinancialMovementItemResponse
  currencyCode: string
  isSale: boolean
  isBusy: boolean
  onEdit: (item: FinancialMovementItemResponse) => void
  onRetire: (item: FinancialMovementItemResponse) => void
}

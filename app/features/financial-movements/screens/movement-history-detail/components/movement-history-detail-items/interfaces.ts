import type { FinancialMovementHistoryItemDetailResponse } from "~/services/financial-movements/get-financial-movement-history-detail/interfaces"

export interface MovementHistoryDetailItemsProps {
  items: FinancialMovementHistoryItemDetailResponse[]
  currencyCode: string
}

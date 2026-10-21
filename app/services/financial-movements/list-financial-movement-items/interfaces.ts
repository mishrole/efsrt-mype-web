import type { FinancialMovementType } from "~/features/financial-movements/constants"
import type { FinancialMovementItemResponse } from "../interfaces"

export interface ListFinancialMovementItemsResponse {
  movementId: string
  movementType: FinancialMovementType
  movementVersion: number
  items: FinancialMovementItemResponse[]
}

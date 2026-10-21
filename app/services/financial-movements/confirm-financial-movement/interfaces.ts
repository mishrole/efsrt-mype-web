import type { FinancialMovementType } from "~/features/financial-movements/constants"

export interface ConfirmFinancialMovementItemVersion {
  itemId: string
  version: number
}

export interface ConfirmFinancialMovementRequest {
  movementVersion: number
  itemVersions: ConfirmFinancialMovementItemVersion[]
}

export interface ConfirmFinancialMovementResponse {
  id: string
  businessId: string
  type: FinancialMovementType
  status: number
  movementDate: string
  currencyCode: string
  totalAmount: number
  estimatedCost: number | null
  estimatedMargin: number | null
  confirmedByUserId: string
  confirmedAt: string
  version: number
}

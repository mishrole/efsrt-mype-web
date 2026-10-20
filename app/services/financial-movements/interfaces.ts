import type { FinancialMovementType } from "~/features/financial-movements/constants"

export interface FinancialMovementDraftResponse {
  id: string
  businessId: string
  type: FinancialMovementType
  status: number
  movementDate: string
  description: string | null
  currencyCode: string
  totalAmount: number
  createdAt: string
  updatedAt: string
  version: number
}

export interface FinancialMovementDraftListItemResponse {
  id: string
  type: FinancialMovementType
  movementDate: string
  description: string | null
  currencyCode: string
  totalAmount: number
  updatedAt: string
  version: number
}

export interface CreateFinancialMovementDraftRequest {
  type: FinancialMovementType
  movementDate: string
  description: string | null
}

export interface UpdateFinancialMovementDraftRequest {
  movementDate: string
  description: string | null
  version: number
}

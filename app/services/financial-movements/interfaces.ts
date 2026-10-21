import type { FinancialMovementType } from "~/features/financial-movements/constants"

export interface FinancialMovementItemResponse {
  id: string
  categoryId: string
  categoryName: string
  productId: string | null
  productCategoryId: string | null
  productName: string | null
  description: string | null
  quantity: number
  unitAmount: number
  unitCostSnapshot: number | null
  subtotalAmount: number
  estimatedCost: number | null
  estimatedMargin: number | null
  version: number
}

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

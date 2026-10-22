import type { FinancialMovementType } from "~/features/financial-movements/constants"
import type { FinancialMovementStatus } from "../list-financial-movement-history/interfaces"

export enum MovementEvidenceStatus {
  Active = 1,
  PendingPurge = 2,
  Purged = 3,
}

export interface FinancialMovementHistoryItemDetailResponse {
  id: string
  categoryId: string
  categoryName: string | null
  categoryIsActive: boolean | null
  productId: string | null
  productName: string | null
  productIsActive: boolean | null
  description: string
  quantity: number
  unitAmount: number
  unitCostSnapshot: number | null
  subtotalAmount: number
  isActive: boolean
  retiredAt: string | null
  version: number
}

export interface FinancialMovementHistoryEvidenceResponse {
  id: string
  originalFileName: string
  mimeType: string
  sizeBytes: number
  status: MovementEvidenceStatus
  uploadedAt: string
  version: number
}

export interface FinancialMovementHistoryDetailResponse {
  id: string
  businessId: string
  type: FinancialMovementType
  status: FinancialMovementStatus
  movementDate: string
  description: string | null
  currencyCode: string
  totalAmount: number
  createdByUserId: string
  updatedByUserId: string
  confirmedByUserId: string | null
  cancelledByUserId: string | null
  cancellationReason: string | null
  createdAt: string
  updatedAt: string
  confirmedAt: string | null
  cancelledAt: string | null
  discardedAt: string | null
  estimatedCost: number | null
  estimatedMargin: number | null
  isEditable: boolean
  allowedActions: string[]
  version: number
  items: FinancialMovementHistoryItemDetailResponse[]
  evidences: FinancialMovementHistoryEvidenceResponse[]
}

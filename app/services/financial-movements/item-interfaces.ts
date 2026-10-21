import type { FinancialMovementItemResponse } from "./interfaces"

export interface FinancialMovementItemMaintenanceResponse {
  item: FinancialMovementItemResponse
  movementTotal: number
  movementVersion: number
}

export interface RetiredFinancialMovementItemResponse {
  itemId: string
  isActive: boolean
  retiredAt: string
  itemVersion: number
  movementTotal: number
  movementVersion: number
}

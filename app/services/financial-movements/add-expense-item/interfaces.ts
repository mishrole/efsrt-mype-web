import type { FinancialMovementItemMaintenanceResponse } from "../item-interfaces"

export interface AddExpenseItemRequest {
  categoryId: string
  description: string
  quantity: number
  unitAmount: number
  movementVersion: number
}

export type AddExpenseItemResponse = FinancialMovementItemMaintenanceResponse

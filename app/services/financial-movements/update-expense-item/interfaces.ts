import type { FinancialMovementItemMaintenanceResponse } from "../item-interfaces"

export interface UpdateExpenseItemRequest {
  categoryId: string
  description: string
  quantity: number
  unitAmount: number
  movementVersion: number
  itemVersion: number
}

export type UpdateExpenseItemResponse = FinancialMovementItemMaintenanceResponse

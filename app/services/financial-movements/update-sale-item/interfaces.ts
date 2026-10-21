import type { FinancialMovementItemMaintenanceResponse } from "../item-interfaces"
export interface UpdateSaleItemRequest {
  productId: string
  quantity: number
  unitAmount: number
  movementVersion: number
  itemVersion: number
}
export type UpdateSaleItemResponse = FinancialMovementItemMaintenanceResponse

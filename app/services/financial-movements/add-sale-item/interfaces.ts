import type { FinancialMovementItemMaintenanceResponse } from "../item-interfaces"
export interface AddSaleItemRequest {
  productId: string
  quantity: number
  unitAmount: number
  movementVersion: number
}
export type AddSaleItemResponse = FinancialMovementItemMaintenanceResponse

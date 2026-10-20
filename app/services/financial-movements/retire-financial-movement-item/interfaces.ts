import type { RetiredFinancialMovementItemResponse } from "../item-interfaces"
export interface RetireFinancialMovementItemRequest {
  movementVersion: number
  itemVersion: number
}
export type RetireFinancialMovementItemResponse =
  RetiredFinancialMovementItemResponse

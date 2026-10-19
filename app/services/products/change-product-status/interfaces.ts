import type { ProductMaintenanceResponse } from "../update-product/interfaces"
export interface ChangeProductStatusRequest { businessId: string; productId: string; version: number }
export type ChangeProductStatusResponse = ProductMaintenanceResponse

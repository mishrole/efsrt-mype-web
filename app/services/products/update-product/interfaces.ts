export interface UpdateProductRequest {
  name: string
  categoryId: string
  productCategoryId: string
  salePrice: number
  unitCost: number
  version: number
}
export interface ProductMaintenanceResponse {
  id: string
  businessId: string
  categoryId: string
  categoryName: string
  name: string
  salePrice: number
  unitCost: number
  isActive: boolean
  deactivatedAt: string | null
  createdAt: string
  updatedAt: string
  version: number
}

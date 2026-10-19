export interface CreateProductRequest {
  name: string
  categoryId: string
  productCategoryId: string
  salePrice: number
  unitCost: number
}
export interface CreateProductResponse {
  id: string
  businessId: string
  categoryId: string
  categoryName: string
  name: string
  salePrice: number
  unitCost: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

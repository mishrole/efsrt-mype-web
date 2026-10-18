import type { CategoryType } from "~/services/categories/interfaces"

export interface GetProductDetailRequest {
  businessId: string
  productId: string
}

export interface ProductDetailResponse {
  id: string
  businessId: string
  categoryId: string
  categoryName: string
  categoryType: CategoryType
  name: string
  salePrice: number
  unitCost: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  version: number
}

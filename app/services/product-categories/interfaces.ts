export interface ProductCategoryResponse {
  id: string
  businessId: string
  name: string
  color: string
  isDefault: boolean
  isActive: boolean
  deactivatedAt: string | null
  createdAt: string
  updatedAt: string
  version: number
}

export interface ProductCategoryFilters {
  businessId: string
  search?: string
  isActive?: boolean
}

export interface CreateProductCategoryRequest {
  name: string
  color: string
}

export interface UpdateProductCategoryRequest {
  name: string
  color: string
  version: number
}

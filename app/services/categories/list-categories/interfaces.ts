import type { CategoryType } from "../interfaces"

export interface ListCategoriesRequest {
  businessId: string
  type?: CategoryType
  isActive?: boolean
}

export interface CategoryListItemResponse {
  id: string
  businessId: string
  name: string
  type: CategoryType
  isDefault: boolean
  isActive: boolean
}

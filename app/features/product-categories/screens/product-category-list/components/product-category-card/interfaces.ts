import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"

export interface ProductCategoryCardProps {
  category: ProductCategoryResponse
  canUpdate: boolean
  canChangeStatus: boolean
  isChangingStatus: boolean
  onEdit: (productCategoryId: string) => void
  onRequestStatusChange: (category: ProductCategoryResponse) => void
}

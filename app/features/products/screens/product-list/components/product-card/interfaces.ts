import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"

export interface ProductCardProps {
  product: ProductListItemResponse
  currencyCode: string
  canChangeStatus: boolean
  isChangingStatus: boolean
  onView: (productId: string) => void
  onRequestStatusChange: (product: ProductListItemResponse) => void
}

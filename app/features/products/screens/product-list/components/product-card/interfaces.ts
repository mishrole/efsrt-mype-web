import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"

export interface ProductCardProps {
  product: ProductListItemResponse
  currencyCode: string
  onView: (productId: string) => void
}

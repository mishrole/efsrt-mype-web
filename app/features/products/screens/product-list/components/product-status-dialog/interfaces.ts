import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"

export interface ProductStatusDialogProps {
  product: ProductListItemResponse | null
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

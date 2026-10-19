import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"

export interface ProductCategoryStatusDialogProps {
  category: ProductCategoryResponse | null
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
}

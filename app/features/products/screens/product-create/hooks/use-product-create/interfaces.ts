import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"
import type { ProductFormValues } from "~/features/products/components/product-form/interfaces"

export interface UseProductCreateResult {
  productCategories: ProductCategoryResponse[]
  isLoading: boolean
  isSubmitting: boolean
  error: string
  canSubmit: boolean
  submitProduct: (values: ProductFormValues) => Promise<void>
  returnToProducts: () => void
}

import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import type { ProductFormValues } from "../../components/product-form/interfaces"

export interface UseProductCreateResult {
  categories: CategoryListItemResponse[]
  isLoading: boolean
  isSubmitting: boolean
  error: string
  submitProduct: (values: ProductFormValues) => Promise<void>
  cancel: () => void
}

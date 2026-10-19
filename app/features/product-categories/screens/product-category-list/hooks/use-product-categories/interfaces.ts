import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"
import type { ProductCategoryFilterValues } from "../../components/product-category-filters/interfaces"

export interface UseProductCategoriesResult {
  productCategories: ProductCategoryResponse[]
  filters: ProductCategoryFilterValues
  pendingStatusCategory: ProductCategoryResponse | null
  isLoading: boolean
  isChangingStatus: boolean
  error: string
  canCreate: boolean
  canUpdate: boolean
  canDeactivate: boolean
  canReactivate: boolean
  setFilters: (filters: ProductCategoryFilterValues) => void
  applyFilters: () => void
  clearFilters: () => void
  createProductCategory: () => void
  editProductCategory: (productCategoryId: string) => void
  requestStatusChange: (category: ProductCategoryResponse) => void
  cancelStatusChange: () => void
  confirmStatusChange: () => Promise<void>
  cancel: () => void
}

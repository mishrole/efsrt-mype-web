import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"
import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"
import type { ProductFilterValues } from "../../components/product-filters/interfaces"

export interface UseProductsResult {
  products: ProductListItemResponse[]
  productCategories: ProductCategoryResponse[]
  filters: ProductFilterValues
  pendingStatusProduct: ProductListItemResponse | null
  currencyCode: string
  canCreate: boolean
  canDeactivate: boolean
  canReactivate: boolean
  isLoading: boolean
  isChangingStatus: boolean
  error: string
  setFilters: (filters: ProductFilterValues) => void
  applyFilters: () => void
  clearFilters: () => void
  viewProduct: (productId: string) => void
  createProduct: () => void
  requestStatusChange: (product: ProductListItemResponse) => void
  cancelStatusChange: () => void
  confirmStatusChange: () => Promise<void>
}

import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"
import type { ProductFilterValues } from "../../components/product-filters/interfaces"

export interface UseProductsResult {
  products: ProductListItemResponse[]
  categories: CategoryListItemResponse[]
  filters: ProductFilterValues
  currencyCode: string
  canCreate: boolean
  isLoading: boolean
  error: string
  setFilters: (filters: ProductFilterValues) => void
  applyFilters: () => void
  clearFilters: () => void
  viewProduct: (productId: string) => void
  createProduct: () => void
}

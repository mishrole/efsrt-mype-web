import type { ProductStatusFilter } from "~/features/products/constants"
import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"

export interface ProductFilterValues {
  search: string
  productCategoryId: string
  status: ProductStatusFilter
}

export interface ProductFiltersProps {
  productCategories: ProductCategoryResponse[]
  values: ProductFilterValues
  disabled?: boolean
  onChange: (values: ProductFilterValues) => void
  onApply: () => void
  onClear: () => void
}

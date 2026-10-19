import type { ProductCategoryStatusFilter } from "~/features/product-categories/constants"

export interface ProductCategoryFilterValues {
  search: string
  status: ProductCategoryStatusFilter
}

export interface ProductCategoryFiltersProps {
  values: ProductCategoryFilterValues
  disabled?: boolean
  onChange: (values: ProductCategoryFilterValues) => void
  onApply: () => void
  onClear: () => void
}

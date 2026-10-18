import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import type { ProductStatusFilter } from "~/features/products/constants"

export interface ProductFilterValues {
  search: string
  categoryId: string
  status: ProductStatusFilter
}

export interface ProductFiltersProps {
  categories: CategoryListItemResponse[]
  values: ProductFilterValues
  disabled?: boolean
  onChange: (values: ProductFilterValues) => void
  onApply: () => void
  onClear: () => void
}

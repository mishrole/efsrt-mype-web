import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import type { MovementHistoryFilters } from "../../hooks/use-movement-history/interfaces"

export interface MovementHistoryFiltersProps {
  values: MovementHistoryFilters
  categories: CategoryListItemResponse[]
  disabled?: boolean
  onChange: (values: MovementHistoryFilters) => void
  onApply: () => void
  onClear: () => void
}

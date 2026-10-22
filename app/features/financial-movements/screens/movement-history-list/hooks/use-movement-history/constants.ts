import type { MovementHistoryFilters } from "./interfaces"

export const MOVEMENT_HISTORY_PAGE_SIZE = 20

export const EMPTY_MOVEMENT_HISTORY_FILTERS: MovementHistoryFilters = {
  type: undefined,
  status: undefined,
  dateFrom: "",
  dateTo: "",
  categoryId: "",
}

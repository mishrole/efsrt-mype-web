export interface MovementHistoryPaginationProps {
  page: number
  pageSize: number
  totalCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  disabled?: boolean
  onPreviousPage: () => void
  onNextPage: () => void
}

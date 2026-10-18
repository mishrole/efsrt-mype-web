import type { NewItemType } from "../dashboard-header/constants"

export interface CreateMovementPlaceholderProps {
  open: boolean
  itemType: NewItemType | null
  onClose: () => void
}

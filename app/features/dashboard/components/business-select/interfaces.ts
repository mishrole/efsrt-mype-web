import type { BusinessSummary } from "~/services/businesses/list-user-businesses/interfaces"

export interface BusinessSelectProps {
  businesses: BusinessSummary[]
  currentBusinessId: string
  onChange: (businessId: string) => void
}

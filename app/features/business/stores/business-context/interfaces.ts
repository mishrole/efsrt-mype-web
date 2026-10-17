import type { BusinessContext } from "../../../../services/businesses/get-business-context/interfaces"
import type { BusinessSummary } from "../../../../services/businesses/list-user-businesses/interfaces"

export interface BusinessContextState {
  businesses: BusinessSummary[]
  currentBusinessId: string | null
  context: BusinessContext | null
  setBusinesses: (businesses: BusinessSummary[]) => void
  selectBusiness: (businessId: string) => void
  setContext: (context: BusinessContext | null) => void
  clearBusinessContext: () => void
}

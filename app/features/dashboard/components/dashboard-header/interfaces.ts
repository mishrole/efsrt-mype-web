import type { BusinessSummary } from "../../../../services/businesses/list-user-businesses/interfaces"

export interface DashboardHeaderProps {
  businesses: BusinessSummary[]
  currentBusinessId: string
  displayName: string
  onBusinessChange: (businessId: string) => void
  onLogout: () => Promise<void>
}

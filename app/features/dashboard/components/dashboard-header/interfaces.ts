import type { AuthenticatedUser } from "~/services/auth/login/interfaces"
import type { BusinessSummary } from "~/services/businesses/list-user-businesses/interfaces"
import type { UserMenuShortcut } from "~/shared/components/user-menu/interfaces"

export interface DashboardHeaderProps {
  businesses: BusinessSummary[]
  currentBusinessId: string
  user: AuthenticatedUser | null
  shortcuts?: UserMenuShortcut[]
  onBusinessChange: (businessId: string) => void
  onLogout: () => Promise<void>
}

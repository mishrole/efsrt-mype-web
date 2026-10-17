import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { APP_PATHS } from "~/shared/constants/pages"

export function useAuthenticatedRouteRedirect(): boolean {
  const navigate = useNavigate()
  const isAuthenticated = useAuthSessionStore((state) => state.isAuthenticated)

  useEffect(() => {
    async function redirectAuthenticatedUser(): Promise<void> {
      if (isAuthenticated)
        await navigate(APP_PATHS.DASHBOARD, { replace: true })
    }

    void redirectAuthenticatedUser()
  }, [isAuthenticated, navigate])

  return isAuthenticated
}

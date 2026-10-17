import { useAuthSessionStore } from "~/features/auth/stores/session"
import { refreshSession } from "~/services/auth/refresh"
import { configureAuthRefresh } from "~/shared/http/client"

export function configureAutomaticSessionRefresh(): void {
  configureAuthRefresh({
    refreshSession,
    setSession: (session) => {
      useAuthSessionStore.getState().setSession(session)
    },
    clearSession: () => {
      useAuthSessionStore.getState().clearSession()
    },
  })
}

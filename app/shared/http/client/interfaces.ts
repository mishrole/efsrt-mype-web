import type { AuthSession } from "~/features/auth/stores/session/interfaces"

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
  accessToken?: string
  skipAuthRefresh?: boolean
}

export interface AuthRefreshConfiguration {
  refreshSession: () => Promise<AuthSession>
  setSession: (session: AuthSession) => void
  clearSession: () => void
}

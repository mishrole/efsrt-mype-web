export interface AuthenticatedUser {
  id: string
  email: string
  displayName: string
  status: number
}

export interface RefreshSessionResponse {
  accessToken: string
  tokenType: string
  expiresAt: string
  user: AuthenticatedUser
}

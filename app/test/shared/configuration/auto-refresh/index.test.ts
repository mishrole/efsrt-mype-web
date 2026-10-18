import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { refreshSession } from "~/services/auth/refresh"
import { configureAutomaticSessionRefresh } from "~/shared/configuration/auto-refresh"
import { configureAuthRefresh } from "~/shared/http/client"

vi.mock("~/services/auth/refresh", () => ({ refreshSession: vi.fn() }))
vi.mock("~/shared/http/client", () => ({ configureAuthRefresh: vi.fn() }))

const configureAuthRefreshMock = vi.mocked(configureAuthRefresh)

describe("configureAutomaticSessionRefresh", () => {
  beforeEach(() => {
    configureAuthRefreshMock.mockReset()
  })

  it("connects refresh and session store operations to the HTTP client", async () => {
    const setSession = vi.spyOn(useAuthSessionStore.getState(), "setSession")
    const clearSession = vi.spyOn(
      useAuthSessionStore.getState(),
      "clearSession",
    )

    configureAutomaticSessionRefresh()

    const configuration = configureAuthRefreshMock.mock.calls[0][0]
    expect(configuration.refreshSession).toBe(refreshSession)

    const session = {
      accessToken: "renewed-token",
      tokenType: "Bearer",
      expiresAt: "2026-10-18T10:00:00Z",
      user: {
        id: "user-id",
        email: "user@example.com",
        displayName: "Mitchell",
        status: 1,
      },
    }

    configuration.setSession(session)
    configuration.clearSession()

    expect(setSession).toHaveBeenCalledWith(session)
    expect(clearSession).toHaveBeenCalledOnce()
  })
})

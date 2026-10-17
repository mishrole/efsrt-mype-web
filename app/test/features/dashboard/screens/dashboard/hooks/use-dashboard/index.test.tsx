import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { useDashboard } from "~/features/dashboard/screens/dashboard/hooks/use-dashboard"
import { logout } from "~/services/auth/logout"
import { getBusinessContext } from "~/services/businesses/get-business-context"
import { listUserBusinesses } from "~/services/businesses/list-user-businesses"
import { getFinancialDashboard } from "~/services/financial-dashboard/get-financial-dashboard"
import { FinancialDashboardGranularity } from "~/services/financial-dashboard/get-financial-dashboard/interfaces"

const navigate = vi.hoisted(() => vi.fn())
const abortBusinesses = vi.hoisted(() => vi.fn())
const abortDashboard = vi.hoisted(() => vi.fn())
const createBusinessesSignal = vi.hoisted(() => vi.fn())
const createDashboardSignal = vi.hoisted(() => vi.fn())
const abortableRequestMockState = vi.hoisted(() => ({ callIndex: 0 }))

vi.mock("react-router", () => ({
  useNavigate: () => navigate,
}))

vi.mock("~/services/auth/logout", () => ({
  logout: vi.fn(),
}))

vi.mock("~/services/businesses/get-business-context", () => ({
  getBusinessContext: vi.fn(),
}))

vi.mock("~/services/businesses/list-user-businesses", () => ({
  listUserBusinesses: vi.fn(),
}))

vi.mock("~/services/financial-dashboard/get-financial-dashboard", () => ({
  getFinancialDashboard: vi.fn(),
}))

vi.mock("~/shared/hooks/use-abortable-request", () => ({
  useAbortableRequest: vi.fn(() => {
    const isBusinessesRequest = abortableRequestMockState.callIndex % 2 === 0
    abortableRequestMockState.callIndex += 1

    return isBusinessesRequest
      ? { createSignal: createBusinessesSignal, abort: abortBusinesses }
      : { createSignal: createDashboardSignal, abort: abortDashboard }
  }),
}))

const listBusinessesMock = vi.mocked(listUserBusinesses)
const getContextMock = vi.mocked(getBusinessContext)
const getDashboardMock = vi.mocked(getFinancialDashboard)
const logoutMock = vi.mocked(logout)

const business = {
  businessId: "business-id",
  displayName: "Pepito Grillo S.A.C.",
  currencyCode: "PEN",
  status: 1,
  membershipId: "membership-id",
  roleCode: "OWNER",
}

const context = {
  businessId: business.businessId,
  displayName: business.displayName,
  currencyCode: business.currencyCode,
  membershipId: business.membershipId,
  roleId: "role-id",
  roleCode: business.roleCode,
  permissions: ["DASHBOARD_READ"],
}

const dashboard = {
  businessId: business.businessId,
  currencyCode: "PEN",
  dateFrom: "2026-09-17",
  dateTo: "2026-10-16",
  granularity: FinancialDashboardGranularity.Day,
  openingBalance: 1000,
  cashInflow: 0,
  cashOutflow: 0,
  netCashFlow: 0,
  closingBalance: 1000,
  estimatedCost: 0,
  estimatedGrossMargin: 0,
  confirmedSaleCount: 0,
  confirmedExpenseCount: 0,
  averageSaleAmount: 0,
  trend: [],
  saleByCategory: [],
  expenseByCategory: [],
}

function activeSignal(): AbortSignal {
  return new AbortController().signal
}

function resetStores(accessToken: string | null = "access-token"): void {
  useAuthSessionStore.setState({
    accessToken,
    tokenType: accessToken ? "Bearer" : null,
    expiresAt: accessToken ? "2026-10-16T20:00:00Z" : null,
    user: accessToken
      ? {
          id: "user-id",
          email: "user@example.com",
          displayName: "Mitchell",
          status: 1,
        }
      : null,
    isAuthenticated: Boolean(accessToken),
  })

  useBusinessContextStore.getState().clearBusinessContext()
}

describe("useDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    abortableRequestMockState.callIndex = 0
    createBusinessesSignal.mockReturnValue(activeSignal())
    createDashboardSignal.mockReturnValue(activeSignal())
    listBusinessesMock.mockResolvedValue([business])
    getContextMock.mockResolvedValue(context)
    getDashboardMock.mockResolvedValue(dashboard)
    logoutMock.mockResolvedValue(undefined)
    resetStores()
  })

  it("loads businesses, selects the first one and loads its dashboard", async () => {
    const { result } = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(result.current.dashboard).toEqual(dashboard)
    })

    expect(result.current.businesses).toEqual([business])
    expect(result.current.currentBusinessId).toBe(business.businessId)
    expect(result.current.isLoading).toBe(false)
    expect(getContextMock).toHaveBeenCalledWith(
      business.businessId,
      "access-token",
      expect.any(AbortSignal),
    )
    expect(getDashboardMock).toHaveBeenCalledWith(
      {
        businessId: business.businessId,
        dateFrom: undefined,
        dateTo: undefined,
        granularity: FinancialDashboardGranularity.Auto,
      },
      "access-token",
      expect.any(AbortSignal),
    )
  })

  it("shows onboarding when the user has no businesses", async () => {
    listBusinessesMock.mockResolvedValue([])

    const { result } = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(result.current.needsOnboarding).toBe(true)
    })

    expect(result.current.dashboard).toBeNull()
    expect(getContextMock).not.toHaveBeenCalled()
  })

  it("preserves the stored business when it is still available", async () => {
    useBusinessContextStore.getState().selectBusiness(business.businessId)

    const { result } = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(result.current.dashboard).toEqual(dashboard)
    })

    expect(result.current.currentBusinessId).toBe(business.businessId)
  })

  it("changes business and ignores selecting the current business", async () => {
    const secondBusiness = {
      ...business,
      businessId: "business-2",
      displayName: "Segundo negocio",
    }

    listBusinessesMock.mockResolvedValue([business, secondBusiness])

    const { result } = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(result.current.dashboard).toEqual(dashboard)
    })

    const abortCountBeforeSelectingCurrentBusiness =
      abortDashboard.mock.calls.length

    act(() => {
      result.current.selectBusiness(business.businessId)
    })

    expect(abortDashboard).toHaveBeenCalledTimes(
      abortCountBeforeSelectingCurrentBusiness,
    )

    const abortCountBeforeChangingBusiness = abortDashboard.mock.calls.length

    act(() => {
      result.current.selectBusiness(secondBusiness.businessId)
    })

    expect(abortDashboard.mock.calls.length).toBeGreaterThan(
      abortCountBeforeChangingBusiness,
    )

    expect(result.current.currentBusinessId).toBe(secondBusiness.businessId)
    expect(result.current.dashboard).toBeNull()
  })

  it("reloads the dashboard when filters change", async () => {
    const { result } = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(result.current.dashboard).toEqual(dashboard)
    })

    getDashboardMock.mockClear()

    act(() => {
      result.current.setFilters({
        dateFrom: "2026-10-01",
        dateTo: "2026-10-16",
        granularity: FinancialDashboardGranularity.Month,
      })
    })

    await waitFor(() => {
      expect(getDashboardMock).toHaveBeenCalledWith(
        {
          businessId: business.businessId,
          dateFrom: "2026-10-01",
          dateTo: "2026-10-16",
          granularity: FinancialDashboardGranularity.Month,
        },
        "access-token",
        expect.any(AbortSignal),
      )
    })
  })

  it("reloads businesses preferring the newly-created business", async () => {
    const newBusiness = {
      ...business,
      businessId: "new-business",
    }

    const { result } = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(result.current.dashboard).toEqual(dashboard)
    })

    listBusinessesMock.mockResolvedValue([business, newBusiness])

    await act(async () => {
      await result.current.reloadAfterCreation(newBusiness.businessId)
    })

    expect(result.current.currentBusinessId).toBe(newBusiness.businessId)
  })

  it("redirects to login when there is no access token", async () => {
    resetStores(null)

    renderHook(() => useDashboard())

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/login")
    })

    expect(listBusinessesMock).not.toHaveBeenCalled()
  })

  it("redirects and clears state after a 401", async () => {
    listBusinessesMock.mockRejectedValue(
      Object.assign(new Error("Unauthorized"), {
        status: 401,
        code: "UNAUTHENTICATED",
      }),
    )

    renderHook(() => useDashboard())

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/login")
    })

    expect(useAuthSessionStore.getState().accessToken).toBeNull()
    expect(useBusinessContextStore.getState().currentBusinessId).toBeNull()
  })

  it("shows API and fallback errors", async () => {
    listBusinessesMock.mockRejectedValue(
      Object.assign(new Error("No disponible"), {
        status: 500,
        code: "INTERNAL_ERROR",
      }),
    )

    const first = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(first.result.current.error).toBe("No disponible")
    })

    first.unmount()
    resetStores()
    listBusinessesMock.mockRejectedValue(new Error("network"))

    const second = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(second.result.current.error).toBe(
        "No fue posible cargar los negocios.",
      )
    })
  })

  it("shows a dashboard loading error", async () => {
    getDashboardMock.mockRejectedValue(new Error("network"))

    const { result } = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(result.current.error).toBe("No fue posible cargar el dashboard.")
    })

    expect(result.current.isLoading).toBe(false)
  })

  it("ignores aborted business and dashboard requests", async () => {
    const abortedBusinesses = new AbortController()
    abortedBusinesses.abort()
    createBusinessesSignal.mockReturnValueOnce(abortedBusinesses.signal)

    const first = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(listBusinessesMock).toHaveBeenCalled()
    })

    expect(first.result.current.businesses).toEqual([])
    first.unmount()

    resetStores()

    const abortedDashboard = new AbortController()
    abortedDashboard.abort()
    createBusinessesSignal.mockReturnValue(activeSignal())
    createDashboardSignal.mockReturnValue(abortedDashboard.signal)
    listBusinessesMock.mockResolvedValue([business])

    renderHook(() => useDashboard())

    await waitFor(() => {
      expect(getDashboardMock).toHaveBeenCalled()
    })

    expect(useBusinessContextStore.getState().context).toBeNull()
  })

  it("logs out and redirects even when logout fails", async () => {
    logoutMock.mockRejectedValue(new Error("network"))

    const { result } = renderHook(() => useDashboard())

    await waitFor(() => {
      expect(result.current.dashboard).toEqual(dashboard)
    })

    await expect(result.current.logoutCurrentSession()).rejects.toThrow(
      "network",
    )

    expect(navigate).toHaveBeenCalledWith("/login")
    expect(abortBusinesses).toHaveBeenCalled()
    expect(abortDashboard).toHaveBeenCalled()
  })
})

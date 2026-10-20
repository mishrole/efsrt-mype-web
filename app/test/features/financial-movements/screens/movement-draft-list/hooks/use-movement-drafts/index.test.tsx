import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useMovementDrafts } from "~/features/financial-movements/screens/movement-draft-list/hooks/use-movement-drafts"
import type { FinancialMovementDraftListItemResponse } from "~/services/financial-movements/interfaces"
import { listFinancialMovementDrafts } from "~/services/financial-movements/list-financial-movement-drafts"
import { APP_PATHS } from "~/shared/constants/pages"
import { createApiError } from "~/shared/http/errors"
const navigateMock = vi.fn()
const authState = { accessToken: "token" as string | null }
const businessState = {
  currentBusinessId: "business" as string | null,
  context: { permissions: ["MOVEMENT_CREATE"] } as {
    permissions: string[]
  } | null,
}
vi.mock("react-router", () => ({ useNavigate: () => navigateMock }))
vi.mock("~/features/auth/stores/session", () => ({
  useAuthSessionStore: (selector: (state: typeof authState) => unknown) =>
    selector(authState),
}))
vi.mock("~/features/business/stores/business-context", () => ({
  useBusinessContextStore: (
    selector: (state: typeof businessState) => unknown,
  ) => selector(businessState),
}))
vi.mock(
  "~/services/financial-movements/list-financial-movement-drafts",
  () => ({
    listFinancialMovementDrafts: vi.fn(),
  }),
)
const listMock = vi.mocked(listFinancialMovementDrafts)
const movement: FinancialMovementDraftListItemResponse = {
  id: "movement",
  type: 1,
  movementDate: "2026-10-19",
  description: null,
  currencyCode: "PEN",
  totalAmount: 0,
  updatedAt: "2026-10-19T00:00:00Z",
  version: 1,
}
describe("useMovementDrafts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authState.accessToken = "token"
    businessState.currentBusinessId = "business"
    businessState.context = { permissions: ["MOVEMENT_CREATE"] }
    listMock.mockResolvedValue([movement])
  })
  it("loads permissions and navigates", async () => {
    const { result } = renderHook(() => useMovementDrafts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.movements).toEqual([movement])
    expect(result.current.canCreate).toBe(true)
    act(() => result.current.createSale())
    act(() => result.current.createExpense())
    act(() => result.current.viewMovement("movement"))
    act(() => result.current.returnToDashboard())
    expect(navigateMock).toHaveBeenNthCalledWith(
      1,
      APP_PATHS.FINANCIAL_MOVEMENT_CREATE("sale"),
    )
    expect(navigateMock).toHaveBeenNthCalledWith(
      2,
      APP_PATHS.FINANCIAL_MOVEMENT_CREATE("expense"),
    )
    expect(navigateMock).toHaveBeenNthCalledWith(
      3,
      APP_PATHS.FINANCIAL_MOVEMENT_DETAIL("movement"),
    )
    expect(navigateMock).toHaveBeenNthCalledWith(4, APP_PATHS.DASHBOARD)
  })
  it("handles missing context, API and fallback errors", async () => {
    listMock.mockRejectedValueOnce(createApiError(400, { message: "API" }))
    const first = renderHook(() => useMovementDrafts())
    await waitFor(() => expect(first.result.current.isLoading).toBe(false))
    expect(first.result.current.error).toBe("API")
    first.unmount()
    listMock.mockRejectedValueOnce(new Error("network"))
    const second = renderHook(() => useMovementDrafts())
    await waitFor(() => expect(second.result.current.isLoading).toBe(false))
    expect(second.result.current.error).toBe(
      "No fue posible cargar los borradores financieros.",
    )
    second.unmount()
    authState.accessToken = null
    businessState.currentBusinessId = null
    businessState.context = null
    const third = renderHook(() => useMovementDrafts())
    await waitFor(() => expect(third.result.current.isLoading).toBe(false))
    expect(third.result.current.movements).toEqual([])
    expect(third.result.current.canCreate).toBe(false)
  })
  it("ignores completion after abort", async () => {
    let resolveList: ((value: (typeof movement)[]) => void) | undefined
    listMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveList = resolve
        }),
    )
    const { unmount } = renderHook(() => useMovementDrafts())
    unmount()
    resolveList?.([movement])
    await Promise.resolve()
    expect(navigateMock).not.toHaveBeenCalled()
  })
})

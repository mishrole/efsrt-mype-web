import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useMovementDraftDetail } from "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail"
import { getFinancialMovementDraft } from "~/services/financial-movements/get-financial-movement-draft"
import type { FinancialMovementDraftResponse } from "~/services/financial-movements/interfaces"
import { updateFinancialMovementDraft } from "~/services/financial-movements/update-financial-movement-draft"
import { APP_PATHS } from "~/shared/constants/pages"
import { createApiError } from "~/shared/http/errors"
const navigateMock = vi.fn()
const params = { movementId: "movement" }
const auth = { accessToken: "token" as string | null }
const business = {
  currentBusinessId: "business" as string | null,
  context: { permissions: ["MOVEMENT_UPDATE"] } as {
    permissions: string[]
  } | null,
}

const serviceMocks = vi.hoisted(() => ({
  getFinancialMovementDraft: vi.fn(),
  updateFinancialMovementDraft: vi.fn(),
}))
vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => params,
}))
vi.mock("~/features/auth/stores/session", () => ({
  useAuthSessionStore: (selector: (state: typeof auth) => unknown) =>
    selector(auth),
}))
vi.mock("~/features/business/stores/business-context", () => ({
  useBusinessContextStore: (selector: (state: typeof business) => unknown) =>
    selector(business),
}))
vi.mock("~/services/financial-movements/get-financial-movement-draft", () => ({
  getFinancialMovementDraft: vi.fn(),
}))
vi.mock(
  "~/services/financial-movements/update-financial-movement-draft",
  () => ({
    updateFinancialMovementDraft: vi.fn(),
  }),
)
const getMock = vi.mocked(getFinancialMovementDraft),
  updateMock = vi.mocked(updateFinancialMovementDraft)
const movement: FinancialMovementDraftResponse = {
  id: "movement",
  businessId: "business",
  type: 1,
  status: 1,
  movementDate: "2026-10-19",
  description: "Venta",
  currencyCode: "PEN",
  totalAmount: 0,
  createdAt: "",
  updatedAt: "",
  version: 1,
}
describe("useMovementDraftDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    params.movementId = "movement"
    auth.accessToken = "token"
    business.currentBusinessId = "business"
    business.context = { permissions: ["MOVEMENT_UPDATE"] }
    getMock.mockResolvedValue(movement)
    updateMock.mockResolvedValue({ ...movement, version: 2 })
  })
  it("loads updates reloads and returns", async () => {
    const { result } = renderHook(() => useMovementDraftDetail())
    await waitFor(() => expect(result.current.movement).toEqual(movement))
    expect(result.current.canUpdate).toBe(true)
    await act(async () =>
      result.current.submitMovement({
        movementDate: "2026-10-20",
        description: "   ",
      }),
    )
    expect(updateMock).toHaveBeenCalledWith(
      "business",
      "movement",
      { movementDate: "2026-10-20", description: null, version: 1 },
      "token",
    )
    expect(result.current.movement?.version).toBe(2)
    await act(async () => result.current.reloadMovement())
    act(() => result.current.returnToMovements())
    expect(navigateMock).toHaveBeenCalledWith(APP_PATHS.FINANCIAL_MOVEMENTS)
  })
  it("handles API and fallback errors", async () => {
    getMock.mockRejectedValueOnce(createApiError(404, { message: "No existe" }))
    const first = renderHook(() => useMovementDraftDetail())
    await waitFor(() => expect(first.result.current.error).toBe("No existe"))
    first.unmount()
    getMock.mockRejectedValueOnce(new Error("network"))
    const second = renderHook(() => useMovementDraftDetail())
    await waitFor(() =>
      expect(second.result.current.error).toBe(
        "No fue posible cargar el borrador financiero.",
      ),
    )
    second.unmount()
    getMock.mockResolvedValue(movement)
    updateMock.mockRejectedValueOnce(new Error("network"))
    const third = renderHook(() => useMovementDraftDetail())
    await waitFor(() => expect(third.result.current.movement).not.toBeNull())
    await act(async () =>
      third.result.current.submitMovement({
        movementDate: "2026-10-20",
        description: "x",
      }),
    )
    expect(third.result.current.error).toBe(
      "No fue posible actualizar el borrador financiero.",
    )
  })
  it("guards missing context and denied permission", async () => {
    auth.accessToken = null
    business.currentBusinessId = null
    business.context = null
    params.movementId = ""
    const { result } = renderHook(() => useMovementDraftDetail())
    await act(async () => result.current.reloadMovement())
    await act(async () =>
      result.current.submitMovement({
        movementDate: "2026-10-20",
        description: "",
      }),
    )
    expect(result.current.canUpdate).toBe(false)
    expect(getMock).not.toHaveBeenCalled()
    expect(updateMock).not.toHaveBeenCalled()
  })

  it("replaces only total and version on the current movement", async () => {
    const { result } = renderHook(() => useMovementDraftDetail())
    await waitFor(() => expect(result.current.movement).toEqual(movement))

    act(() => result.current.applyMovementSummary(30, 11))

    expect(result.current.movement).toEqual({
      ...movement,
      totalAmount: 30,
      version: 11,
    })
  })

  it("keeps null when there is no loaded movement", () => {
    serviceMocks.getFinancialMovementDraft.mockImplementation(
      () => new Promise(() => undefined),
    )
    const { result } = renderHook(() => useMovementDraftDetail())

    act(() => result.current.applyMovementSummary(30, 11))

    expect(result.current.movement).toBeNull()
  })
})

import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useMovementHistoryDetail } from "~/features/financial-movements/screens/movement-history-detail/hooks/use-movement-history-detail"
import { getFinancialMovementHistoryDetail } from "~/services/financial-movements/get-financial-movement-history-detail"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"
import { openMovementEvidence } from "~/services/financial-movements/open-movement-evidence"
import { APP_PATHS } from "~/shared/constants/pages"
import { createApiError } from "~/shared/http/errors"

const navigateMock = vi.fn()
const routeParams = { movementId: "movement-id" }
const authState = { accessToken: "access-token" as string | null }
const businessState = { currentBusinessId: "business-id" as string | null }

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => routeParams,
}))
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
  "~/services/financial-movements/get-financial-movement-history-detail",
  () => ({
    getFinancialMovementHistoryDetail: vi.fn(),
  }),
)
vi.mock("~/services/financial-movements/open-movement-evidence", () => ({
  openMovementEvidence: vi.fn(),
}))

const getDetailMock = vi.mocked(getFinancialMovementHistoryDetail)
const openEvidenceMock = vi.mocked(openMovementEvidence)
const windowOpenMock = vi.spyOn(window, "open").mockImplementation(() => null)
const movement = {
  id: "movement-id",
  businessId: "business-id",
  type: 1 as const,
  status: FinancialMovementStatus.Confirmed,
  movementDate: "2026-10-05",
  description: "Venta",
  currencyCode: "PEN",
  totalAmount: 80,
  createdByUserId: "creator-id",
  updatedByUserId: "updater-id",
  confirmedByUserId: "confirmer-id",
  cancelledByUserId: null,
  cancellationReason: null,
  createdAt: "2026-10-05T20:00:00Z",
  updatedAt: "2026-10-05T21:15:00Z",
  confirmedAt: "2026-10-05T21:15:00Z",
  cancelledAt: null,
  discardedAt: null,
  estimatedCost: 40,
  estimatedMargin: 40,
  isEditable: false,
  allowedActions: [],
  version: 1,
  items: [],
  evidences: [],
}

beforeEach(() => {
  vi.clearAllMocks()
  routeParams.movementId = "movement-id"
  authState.accessToken = "access-token"
  businessState.currentBusinessId = "business-id"
  getDetailMock.mockResolvedValue(movement)
  openEvidenceMock.mockResolvedValue({
    url: "https://temporary.example/evidence",
    expiresAt: "2026-10-22T01:00:00Z",
  })
})

describe("useMovementHistoryDetail", () => {
  it("loads the detail and forwards cancellation support", async () => {
    const { result } = renderHook(() => useMovementHistoryDetail())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.movement).toEqual(movement)
    expect(getDetailMock).toHaveBeenCalledWith(
      "business-id",
      "movement-id",
      "access-token",
      expect.any(AbortSignal),
    )
  })

  it.each([
    [null, "business-id", "movement-id"],
    ["access-token", null, "movement-id"],
    ["access-token", "business-id", ""],
  ])(
    "returns empty state when required context is missing",
    async (accessToken, businessId, movementId) => {
      authState.accessToken = accessToken
      businessState.currentBusinessId = businessId
      routeParams.movementId = movementId

      const { result } = renderHook(() => useMovementHistoryDetail())
      await waitFor(() => expect(result.current.isLoading).toBe(false))

      expect(result.current.movement).toBeNull()
      expect(result.current.error).toBe("")
      expect(getDetailMock).not.toHaveBeenCalled()
    },
  )

  it("maps API and fallback errors", async () => {
    getDetailMock.mockRejectedValueOnce(
      createApiError(404, { message: "No encontrado" }),
    )
    const firstRender = renderHook(() => useMovementHistoryDetail())
    await waitFor(() =>
      expect(firstRender.result.current.error).toBe("No encontrado"),
    )
    firstRender.unmount()

    getDetailMock.mockRejectedValueOnce(new Error("network"))
    const secondRender = renderHook(() => useMovementHistoryDetail())
    await waitFor(() =>
      expect(secondRender.result.current.error).toBe(
        "No fue posible cargar el detalle del movimiento.",
      ),
    )
  })

  it("opens an active evidence using temporary controlled access", async () => {
    const { result } = renderHook(() => useMovementHistoryDetail())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => {
      await result.current.openEvidence("evidence-id")
    })

    expect(openEvidenceMock).toHaveBeenCalledWith(
      "business-id",
      "movement-id",
      "evidence-id",
      "access-token",
    )
    expect(windowOpenMock).toHaveBeenCalledWith(
      "https://temporary.example/evidence",
      "_blank",
      "noopener,noreferrer",
    )
    expect(result.current.openingEvidenceId).toBeNull()
    expect(result.current.evidenceError).toBe("")
  })

  it("reports evidence access errors and prevents concurrent openings", async () => {
    let resolveEvidence:
      ((value: { url: string; expiresAt: string }) => void) | undefined
    openEvidenceMock.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveEvidence = resolve
        }),
    )
    const { result } = renderHook(() => useMovementHistoryDetail())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    let firstOpening: Promise<void> | undefined
    act(() => {
      firstOpening = result.current.openEvidence("first-evidence")
    })
    await waitFor(() =>
      expect(result.current.openingEvidenceId).toBe("first-evidence"),
    )
    await act(async () => {
      await result.current.openEvidence("second-evidence")
      resolveEvidence?.({
        url: "https://temporary.example/first",
        expiresAt: "2026-10-22T01:00:00Z",
      })
      await firstOpening
    })
    expect(openEvidenceMock).toHaveBeenCalledOnce()

    openEvidenceMock.mockRejectedValueOnce(
      createApiError(403, { message: "Evidencia no disponible" }),
    )
    await act(async () => {
      await result.current.openEvidence("failed-evidence")
    })
    expect(result.current.evidenceError).toBe("Evidencia no disponible")
  })

  it("returns explicitly to the history", async () => {
    const { result } = renderHook(() => useMovementHistoryDetail())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    act(() => result.current.returnToHistory())
    expect(navigateMock).toHaveBeenCalledWith(APP_PATHS.FINANCIAL_MOVEMENTS)
  })

  it("ignores completion after unmount", async () => {
    let resolveDetail: ((value: typeof movement) => void) | undefined
    getDetailMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveDetail = resolve
        }),
    )
    const renderedHook = renderHook(() => useMovementHistoryDetail())
    renderedHook.unmount()
    resolveDetail?.(movement)
    await Promise.resolve()
    expect(getDetailMock).toHaveBeenCalledOnce()
  })
})

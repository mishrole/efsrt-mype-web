import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useMovementDraftDetail } from "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail"
import { confirmFinancialMovement } from "~/services/financial-movements/confirm-financial-movement"
import { getFinancialMovementDraft } from "~/services/financial-movements/get-financial-movement-draft"
import type { FinancialMovementDraftResponse } from "~/services/financial-movements/interfaces"
import { updateFinancialMovementDraft } from "~/services/financial-movements/update-financial-movement-draft"
import { APP_PATHS } from "~/shared/constants/pages"
import { createApiError } from "~/shared/http/errors"

const routerMocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  params: { movementId: "movement-id" },
}))

const authState = {
  accessToken: "access-token" as string | null,
}

const businessState = {
  currentBusinessId: "business-id" as string | null,
  context: {
    permissions: ["MOVEMENT_UPDATE", "MOVEMENT_CONFIRM"],
  } as { permissions: string[] } | null,
}

vi.mock("react-router", () => ({
  useNavigate: () => routerMocks.navigate,
  useParams: () => routerMocks.params,
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

vi.mock("~/services/financial-movements/get-financial-movement-draft", () => ({
  getFinancialMovementDraft: vi.fn(),
}))

vi.mock(
  "~/services/financial-movements/update-financial-movement-draft",
  () => ({
    updateFinancialMovementDraft: vi.fn(),
  }),
)

vi.mock("~/services/financial-movements/confirm-financial-movement", () => ({
  confirmFinancialMovement: vi.fn(),
}))

const getMovementMock = vi.mocked(getFinancialMovementDraft)
const updateMovementMock = vi.mocked(updateFinancialMovementDraft)
const confirmMovementMock = vi.mocked(confirmFinancialMovement)

const movement: FinancialMovementDraftResponse = {
  id: "movement-id",
  businessId: "business-id",
  type: 1,
  status: 1,
  movementDate: "2026-10-21",
  description: "Venta",
  currencyCode: "PEN",
  totalAmount: 100,
  createdAt: "2026-10-21T06:00:00Z",
  updatedAt: "2026-10-21T06:00:00Z",
  version: 7,
}

async function renderLoadedHook() {
  const renderedHook = renderHook(() => useMovementDraftDetail())

  await waitFor(() => {
    expect(renderedHook.result.current.movement).toEqual(movement)
  })

  return renderedHook
}

describe("useMovementDraftDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authState.accessToken = "access-token"
    businessState.currentBusinessId = "business-id"
    businessState.context = {
      permissions: ["MOVEMENT_UPDATE", "MOVEMENT_CONFIRM"],
    }
    routerMocks.params.movementId = "movement-id"
    getMovementMock.mockResolvedValue(movement)
    updateMovementMock.mockResolvedValue({
      ...movement,
      movementDate: "2026-10-22",
      description: null,
      version: 8,
    })
    confirmMovementMock.mockResolvedValue({
      id: movement.id,
      businessId: movement.businessId,
      type: movement.type,
      status: 2,
      movementDate: movement.movementDate,
      currencyCode: movement.currencyCode,
      totalAmount: movement.totalAmount,
      estimatedCost: 60,
      estimatedMargin: 40,
      confirmedByUserId: "user-id",
      confirmedAt: "2026-10-21T08:00:00Z",
      version: 8,
    })
  })

  it("loads the movement and exposes both permissions", async () => {
    const { result } = await renderLoadedHook()

    expect(getMovementMock).toHaveBeenCalledWith(
      "business-id",
      "movement-id",
      "access-token",
      expect.any(AbortSignal),
    )
    expect(result.current.canUpdate).toBe(true)
    expect(result.current.canConfirm).toBe(true)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe("")
  })

  it("aborts the load request when unmounted", async () => {
    let receivedSignal: AbortSignal | undefined
    getMovementMock.mockImplementation(
      async (_businessId, _movementId, _accessToken, signal) => {
        receivedSignal = signal
        return new Promise<FinancialMovementDraftResponse>(() => undefined)
      },
    )

    const { unmount } = renderHook(() => useMovementDraftDetail())
    await waitFor(() => expect(receivedSignal).toBeDefined())

    unmount()

    expect(receivedSignal?.aborted).toBe(true)
  })

  it("does not load without authentication or scope", async () => {
    authState.accessToken = null
    businessState.currentBusinessId = null
    routerMocks.params.movementId = ""

    const { result } = renderHook(() => useMovementDraftDetail())

    await act(async () => result.current.reloadMovement())

    expect(result.current.movement).toBeNull()
    expect(getMovementMock).not.toHaveBeenCalled()
  })

  it("ignores a resolved load after its signal was aborted", async () => {
    let resolveMovement:
      ((value: FinancialMovementDraftResponse) => void) | null = null
    getMovementMock.mockImplementation(
      () =>
        new Promise<FinancialMovementDraftResponse>((resolve) => {
          resolveMovement = resolve
        }),
    )

    const renderedHook = renderHook(() => useMovementDraftDetail())
    renderedHook.unmount()

    await act(async () => {
      resolveMovement?.(movement)
    })

    expect(getMovementMock).toHaveBeenCalledOnce()
  })

  it("shows an API error while loading", async () => {
    getMovementMock.mockRejectedValueOnce(
      createApiError(404, {
        code: "MOVEMENT_NOT_FOUND",
        message: "Movimiento no encontrado.",
      }),
    )

    const { result } = renderHook(() => useMovementDraftDetail())

    await waitFor(() => {
      expect(result.current.error).toBe("Movimiento no encontrado.")
    })
    expect(result.current.isLoading).toBe(false)
  })

  it("shows the fallback error while loading", async () => {
    getMovementMock.mockRejectedValueOnce(new Error("network"))

    const { result } = renderHook(() => useMovementDraftDetail())

    await waitFor(() => {
      expect(result.current.error).toBe(
        "No fue posible cargar el borrador financiero.",
      )
    })
  })

  it("reloads the movement explicitly", async () => {
    const { result } = await renderLoadedHook()
    getMovementMock.mockClear()

    await act(async () => result.current.reloadMovement())

    expect(getMovementMock).toHaveBeenCalledWith(
      "business-id",
      "movement-id",
      "access-token",
      undefined,
    )
  })

  it("updates the movement with a trimmed nullable description", async () => {
    const { result } = await renderLoadedHook()

    await act(async () => {
      await result.current.submitMovement({
        movementDate: "2026-10-22",
        description: "   ",
      })
    })

    expect(updateMovementMock).toHaveBeenCalledWith(
      "business-id",
      "movement-id",
      {
        movementDate: "2026-10-22",
        description: null,
        version: 7,
      },
      "access-token",
    )
    expect(result.current.movement?.version).toBe(8)
    expect(result.current.isSubmitting).toBe(false)
  })

  it("shows an API error while updating", async () => {
    updateMovementMock.mockRejectedValueOnce(
      createApiError(409, {
        code: "CONCURRENCY_CONFLICT",
        message: "Conflicto de concurrencia.",
      }),
    )
    const { result } = await renderLoadedHook()

    await act(async () => {
      await result.current.submitMovement({
        movementDate: "2026-10-22",
        description: "Venta actualizada",
      })
    })

    expect(result.current.error).toBe("Conflicto de concurrencia.")
    expect(result.current.isSubmitting).toBe(false)
  })

  it("shows the fallback error while updating", async () => {
    updateMovementMock.mockRejectedValueOnce(new Error("network"))
    const { result } = await renderLoadedHook()

    await act(async () => {
      await result.current.submitMovement({
        movementDate: "2026-10-22",
        description: "Venta actualizada",
      })
    })

    expect(result.current.error).toBe(
      "No fue posible actualizar el borrador financiero.",
    )
  })

  it("guards submission without authentication", async () => {
    const { result, rerender } = await renderLoadedHook()
    authState.accessToken = null

    rerender()

    await waitFor(() => {
      expect(result.current.movement).toBeNull()
    })

    updateMovementMock.mockClear()

    await act(async () => {
      await result.current.submitMovement({
        movementDate: "2026-10-22",
        description: "Venta",
      })
    })

    expect(updateMovementMock).not.toHaveBeenCalled()
  })

  it("navigates back to financial movements", async () => {
    const { result } = await renderLoadedHook()

    act(() => result.current.returnToMovements())

    expect(routerMocks.navigate).toHaveBeenCalledWith(
      APP_PATHS.FINANCIAL_MOVEMENT_DRAFTS,
    )
  })

  it("updates only total and version when the summary changes", async () => {
    const { result } = await renderLoadedHook()

    act(() => result.current.applyMovementSummary(150, 8))

    expect(result.current.movement).toEqual({
      ...movement,
      totalAmount: 150,
      version: 8,
    })
  })

  it("preserves the movement when the summary is unchanged", async () => {
    const { result, rerender } = await renderLoadedHook()
    const currentMovement = result.current.movement

    act(() => result.current.applyMovementSummary(100, 7))
    rerender()

    expect(result.current.movement).toBe(currentMovement)
  })

  it("keeps null when applying a summary before loading", () => {
    getMovementMock.mockImplementation(
      () => new Promise<FinancialMovementDraftResponse>(() => undefined),
    )
    const { result } = renderHook(() => useMovementDraftDetail())

    act(() => result.current.applyMovementSummary(150, 8))

    expect(result.current.movement).toBeNull()
  })

  it("stores active item versions", async () => {
    const { result } = await renderLoadedHook()
    const itemVersions = [
      { itemId: "item-1", version: 2 },
      { itemId: "item-2", version: 4 },
    ]

    act(() => result.current.applyMovementItems(itemVersions))

    expect(result.current.itemVersions).toEqual(itemVersions)
  })

  it("opens and closes the confirmation dialog", async () => {
    const { result } = await renderLoadedHook()

    act(() => result.current.openConfirmDialog())
    expect(result.current.isConfirmDialogOpen).toBe(true)

    act(() => result.current.closeConfirmDialog())
    expect(result.current.isConfirmDialogOpen).toBe(false)
  })

  it("clears an existing error when opening the confirmation dialog", async () => {
    updateMovementMock.mockRejectedValueOnce(new Error("network"))
    const { result } = await renderLoadedHook()
    await act(async () => {
      await result.current.submitMovement({
        movementDate: "2026-10-22",
        description: "Venta",
      })
    })
    expect(result.current.error).not.toBe("")

    act(() => result.current.openConfirmDialog())

    expect(result.current.error).toBe("")
  })

  it("rejects confirmation without active items", async () => {
    const { result } = await renderLoadedHook()
    act(() => result.current.openConfirmDialog())

    await act(async () => result.current.confirmMovement())

    expect(confirmMovementMock).not.toHaveBeenCalled()
    expect(result.current.error).toBe(
      "El movimiento requiere al menos un ítem activo para confirmarse.",
    )
    expect(result.current.isConfirmDialogOpen).toBe(false)
  })

  it("confirms with current movement and item versions", async () => {
    const { result } = await renderLoadedHook()
    const itemVersions = [
      { itemId: "item-1", version: 2 },
      { itemId: "item-2", version: 4 },
    ]
    act(() => result.current.applyMovementItems(itemVersions))
    act(() => result.current.openConfirmDialog())

    await act(async () => result.current.confirmMovement())

    expect(confirmMovementMock).toHaveBeenCalledWith(
      "business-id",
      "movement-id",
      {
        movementVersion: 7,
        itemVersions,
      },
      "access-token",
    )
    expect(routerMocks.navigate).toHaveBeenCalledWith(
      APP_PATHS.FINANCIAL_MOVEMENT_DRAFTS,
    )
    expect(result.current.isConfirmDialogOpen).toBe(false)
    expect(result.current.isConfirming).toBe(false)
  })

  it("shows an API error while confirming and keeps the dialog open", async () => {
    confirmMovementMock.mockRejectedValueOnce(
      createApiError(409, {
        code: "CONCURRENCY_CONFLICT",
        message: "Conflicto de concurrencia.",
      }),
    )
    const { result } = await renderLoadedHook()
    act(() =>
      result.current.applyMovementItems([{ itemId: "item-1", version: 2 }]),
    )
    act(() => result.current.openConfirmDialog())

    await act(async () => result.current.confirmMovement())

    expect(result.current.error).toBe("Conflicto de concurrencia.")
    expect(result.current.isConfirmDialogOpen).toBe(true)
    expect(result.current.isConfirming).toBe(false)
    expect(routerMocks.navigate).not.toHaveBeenCalled()
  })

  it("shows the fallback error while confirming", async () => {
    confirmMovementMock.mockRejectedValueOnce(new Error("network"))
    const { result } = await renderLoadedHook()
    act(() =>
      result.current.applyMovementItems([{ itemId: "item-1", version: 2 }]),
    )

    await act(async () => result.current.confirmMovement())

    expect(result.current.error).toBe(
      "No fue posible confirmar el movimiento financiero.",
    )
  })

  it("guards confirmation without permission", async () => {
    businessState.context = { permissions: ["MOVEMENT_UPDATE"] }
    const { result } = await renderLoadedHook()
    act(() =>
      result.current.applyMovementItems([{ itemId: "item-1", version: 2 }]),
    )

    await act(async () => result.current.confirmMovement())

    expect(result.current.canConfirm).toBe(false)
    expect(confirmMovementMock).not.toHaveBeenCalled()
  })

  it("guards confirmation without authentication", async () => {
    const { result } = await renderLoadedHook()
    authState.accessToken = null
    act(() =>
      result.current.applyMovementItems([{ itemId: "item-1", version: 2 }]),
    )

    await act(async () => result.current.confirmMovement())

    expect(confirmMovementMock).not.toHaveBeenCalled()
  })

  it("exposes stable shared callbacks across equivalent rerenders", async () => {
    const { result, rerender } = await renderLoadedHook()
    const initialCallbacks = {
      reloadMovement: result.current.reloadMovement,
      returnToMovements: result.current.returnToMovements,
      applyMovementSummary: result.current.applyMovementSummary,
      applyMovementItems: result.current.applyMovementItems,
      openConfirmDialog: result.current.openConfirmDialog,
      closeConfirmDialog: result.current.closeConfirmDialog,
      confirmMovement: result.current.confirmMovement,
    }

    rerender()

    expect(result.current.reloadMovement).toBe(initialCallbacks.reloadMovement)
    expect(result.current.returnToMovements).toBe(
      initialCallbacks.returnToMovements,
    )
    expect(result.current.applyMovementSummary).toBe(
      initialCallbacks.applyMovementSummary,
    )
    expect(result.current.applyMovementItems).toBe(
      initialCallbacks.applyMovementItems,
    )
    expect(result.current.openConfirmDialog).toBe(
      initialCallbacks.openConfirmDialog,
    )
    expect(result.current.closeConfirmDialog).toBe(
      initialCallbacks.closeConfirmDialog,
    )
    expect(result.current.confirmMovement).toBe(
      initialCallbacks.confirmMovement,
    )
  })
})

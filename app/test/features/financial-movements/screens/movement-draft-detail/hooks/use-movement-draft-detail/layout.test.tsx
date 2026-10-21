import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import MovementDraftDetailScreen from "~/features/financial-movements/screens/movement-draft-detail"
import { useMovementDraftDetail } from "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail"
import type { UseMovementDraftDetailResult } from "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail/interfaces"

vi.mock(
  "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail",
  () => ({ useMovementDraftDetail: vi.fn() }),
)
vi.mock(
  "~/features/financial-movements/screens/movement-draft-detail/components/movement-items-panel",
  () => ({ MovementItemsPanel: () => <div>items content</div> }),
)
vi.mock(
  "~/features/financial-movements/screens/movement-draft-detail/components/movement-evidences-panel",
  () => ({ MovementEvidencesPanel: () => <div>evidence content</div> }),
)
vi.mock(
  "~/features/financial-movements/components/confirm-financial-movement-dialog",
  () => ({ ConfirmFinancialMovementDialog: () => null }),
)

const movementDetailState: UseMovementDraftDetailResult = {
  movement: {
    id: "movement-id",
    businessId: "business-id",
    type: FINANCIAL_MOVEMENT_TYPES.sale,
    status: 1,
    movementDate: "2026-10-21",
    description: "Venta",
    currencyCode: "PEN",
    totalAmount: 10,
    createdAt: "2026-10-21T08:00:00Z",
    updatedAt: "2026-10-21T08:00:00Z",
    version: 2,
  },
  itemVersions: [{ itemId: "item-id", version: 1 }],
  canUpdate: true,
  canConfirm: true,
  isLoading: false,
  isSubmitting: false,
  isConfirming: false,
  isConfirmDialogOpen: false,
  error: "",
  submitMovement: vi.fn().mockResolvedValue(undefined),
  returnToMovements: vi.fn(),
  reloadMovement: vi.fn().mockResolvedValue(undefined),
  applyMovementSummary: vi.fn(),
  applyMovementItems: vi.fn(),
  openConfirmDialog: vi.fn(),
  closeConfirmDialog: vi.fn(),
  confirmMovement: vi.fn().mockResolvedValue(undefined),
}

describe("MovementDraftDetailScreen layout", () => {
  it("renders the confirmation action and independently open sections", () => {
    vi.mocked(useMovementDraftDetail).mockReturnValue(movementDetailState)

    render(<MovementDraftDetailScreen />)

    expect(
      screen.getByRole("button", { name: "Confirmar movimiento" }),
    ).toBeInTheDocument()
    expect(screen.getByText("items content")).toBeInTheDocument()
    expect(screen.getByText("evidence content")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Editar cabecera" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Volver" }),
    ).not.toBeInTheDocument()
  })

  it("enters header editing mode", () => {
    vi.mocked(useMovementDraftDetail).mockReturnValue(movementDetailState)

    render(<MovementDraftDetailScreen />)
    fireEvent.click(screen.getByRole("button", { name: "Editar cabecera" }))

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument()
  })
})

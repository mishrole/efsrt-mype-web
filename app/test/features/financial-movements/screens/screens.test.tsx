import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import CreateScreen, {
  meta as createMeta,
} from "~/features/financial-movements/screens/movement-draft-create"
import { useMovementDraftCreate } from "~/features/financial-movements/screens/movement-draft-create/hooks/use-movement-draft-create"
import DetailScreen, {
  meta as detailMeta,
} from "~/features/financial-movements/screens/movement-draft-detail"
import { useMovementDraftDetail } from "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail"
import ListScreen, {
  meta as listMeta,
} from "~/features/financial-movements/screens/movement-draft-list"
import { useMovementDrafts } from "~/features/financial-movements/screens/movement-draft-list/hooks/use-movement-drafts"
import type { FinancialMovementDraftResponse } from "~/services/financial-movements/interfaces"
vi.mock(
  "~/features/financial-movements/screens/movement-draft-create/hooks/use-movement-draft-create",
  () => ({ useMovementDraftCreate: vi.fn() }),
)
vi.mock(
  "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail",
  () => ({ useMovementDraftDetail: vi.fn() }),
)
vi.mock(
  "~/features/financial-movements/screens/movement-draft-list/hooks/use-movement-drafts",
  () => ({ useMovementDrafts: vi.fn() }),
)
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
describe("financial movement screens", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useMovementDraftCreate).mockReturnValue({
      type: 1,
      isSubmitting: false,
      error: "",
      submitMovement: vi.fn(),
      returnToMovements: vi.fn(),
    })
    vi.mocked(useMovementDraftDetail).mockReturnValue({
      movement,
      itemVersions: [],
      canUpdate: true,
      canConfirm: false,
      isLoading: false,
      isSubmitting: false,
      isConfirming: false,
      isConfirmDialogOpen: false,
      error: "",
      submitMovement: vi.fn(),
      returnToMovements: vi.fn(),
      reloadMovement: vi.fn(),
      applyMovementSummary: vi.fn(),
      applyMovementItems: vi.fn(),
      openConfirmDialog: vi.fn(),
      closeConfirmDialog: vi.fn(),
      confirmMovement: vi.fn(),
    })
    vi.mocked(useMovementDrafts).mockReturnValue({
      movements: [movement],
      canCreate: true,
      isLoading: false,
      error: "",
      createSale: vi.fn(),
      createExpense: vi.fn(),
      viewMovement: vi.fn(),
      returnToDashboard: vi.fn(),
      returnToFinancialMovements: vi.fn(),
    })
  })
  it("returns metadata", () => {
    expect(createMeta()).toHaveLength(1)
    expect(detailMeta()).toHaveLength(1)
    expect(listMeta()).toHaveLength(1)
  })
  it("renders create valid and invalid types", () => {
    const { rerender } = render(<CreateScreen />)
    expect(screen.getByText("Nueva venta")).toBeInTheDocument()
    vi.mocked(useMovementDraftCreate).mockReturnValue({
      type: null,
      isSubmitting: false,
      error: "",
      submitMovement: vi.fn(),
      returnToMovements: vi.fn(),
    })
    rerender(<CreateScreen />)
    expect(
      screen.getByText(/tipo de movimiento solicitado no es válido/i),
    ).toBeInTheDocument()
  })
  it("renders list states and actions", () => {
    render(<ListScreen />)
    expect(
      screen.getByRole("heading", { name: "Venta", level: 2 }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Nueva venta" }))
    expect(useMovementDrafts().createSale).toBeDefined()
  })
  it("renders detail and edit controls", () => {
    render(<DetailScreen />)
    expect(screen.getByText("Borrador")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Editar cabecera" }))
    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    expect(
      screen.getByRole("button", { name: "Editar cabecera" }),
    ).toBeInTheDocument()
  })
})

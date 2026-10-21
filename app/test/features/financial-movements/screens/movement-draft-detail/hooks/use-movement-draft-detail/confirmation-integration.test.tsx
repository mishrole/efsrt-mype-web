import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MovementDraftDetailScreen from "~/features/financial-movements/screens/movement-draft-detail"
import { useMovementDraftDetail } from "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail"

const dialogMocks = vi.hoisted(() => ({ props: vi.fn() }))
vi.mock(
  "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail",
  () => ({ useMovementDraftDetail: vi.fn() }),
)
vi.mock(
  "~/features/financial-movements/components/financial-movement-form",
  () => ({ FinancialMovementForm: () => <div>header form</div> }),
)
vi.mock(
  "~/features/financial-movements/screens/movement-draft-detail/components/movement-items-panel",
  () => ({ MovementItemsPanel: () => <div>items panel</div> }),
)
vi.mock(
  "~/features/financial-movements/screens/movement-draft-detail/components/movement-evidences-panel",
  () => ({ MovementEvidencesPanel: () => <div>evidences panel</div> }),
)
vi.mock(
  "~/features/financial-movements/components/confirm-financial-movement-dialog",
  () => ({
    ConfirmFinancialMovementDialog: (props: {
      isOpen: boolean
      itemCount: number
    }) => {
      dialogMocks.props(props)
      return props.isOpen ? <div>confirm dialog</div> : null
    },
  }),
)

const movement = {
  id: "movement-id",
  businessId: "business-id",
  type: 1 as const,
  status: 1,
  movementDate: "2026-10-21",
  description: "Venta",
  currencyCode: "PEN",
  totalAmount: 100,
  createdAt: "",
  updatedAt: "",
  version: 7,
}
const openConfirmDialog = vi.fn()

function createHookResult(canConfirm: boolean, itemCount: number) {
  return {
    movement,
    itemVersions: Array.from({ length: itemCount }, (_, itemIndex) => ({
      itemId: `item-${itemIndex}`,
      version: itemIndex + 1,
    })),
    canUpdate: true,
    canConfirm,
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
    openConfirmDialog,
    closeConfirmDialog: vi.fn(),
    confirmMovement: vi.fn(),
  }
}

describe("MovementDraftDetailScreen confirmation integration", () => {
  beforeEach(() => vi.clearAllMocks())

  it("renders and dispatches confirmation with permission and active items", () => {
    vi.mocked(useMovementDraftDetail).mockReturnValue(createHookResult(true, 2))
    render(<MovementDraftDetailScreen />)

    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar movimiento" }),
    )

    expect(openConfirmDialog).toHaveBeenCalledOnce()
    expect(dialogMocks.props).toHaveBeenCalledWith(
      expect.objectContaining({ itemCount: 2, movementType: 1 }),
    )
  })

  it("hides confirmation without permission", () => {
    vi.mocked(useMovementDraftDetail).mockReturnValue(
      createHookResult(false, 2),
    )
    render(<MovementDraftDetailScreen />)
    expect(
      screen.queryByRole("button", { name: "Confirmar movimiento" }),
    ).not.toBeInTheDocument()
  })

  it("disables confirmation without active items", () => {
    vi.mocked(useMovementDraftDetail).mockReturnValue(createHookResult(true, 0))
    render(<MovementDraftDetailScreen />)
    expect(
      screen.getByRole("button", { name: "Confirmar movimiento" }),
    ).toBeDisabled()
  })
})

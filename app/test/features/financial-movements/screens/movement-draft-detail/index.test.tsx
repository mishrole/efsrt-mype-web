import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MovementDraftDetailScreen from "~/features/financial-movements/screens/movement-draft-detail"
import { useMovementDraftDetail } from "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail"
import type { FinancialMovementDraftResponse } from "~/services/financial-movements/interfaces"

const componentMocks = vi.hoisted(() => ({
  submittedValues: { movementDate: "2026-10-20", description: "Cabecera" },
}))

const panelMocks = vi.hoisted(() => ({ evidenceProps: vi.fn() }))

vi.mock(
  "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail",
  () => ({ useMovementDraftDetail: vi.fn() }),
)
vi.mock(
  "~/features/financial-movements/components/financial-movement-form",
  () => ({
    FinancialMovementForm: ({
      isReadOnly,
      onSubmit,
      onCancel,
    }: {
      isReadOnly: boolean
      onSubmit: (values: {
        movementDate: string
        description: string
      }) => Promise<void>
      onCancel: () => void
    }) => (
      <div>
        <span>{isReadOnly ? "readonly" : "editing"}</span>
        <button onClick={() => void onSubmit(componentMocks.submittedValues)}>
          submit header
        </button>
        <button onClick={onCancel}>cancel header</button>
      </div>
    ),
  }),
)
vi.mock(
  "~/features/financial-movements/screens/movement-draft-detail/components/movement-items-panel",
  () => ({ MovementItemsPanel: () => <div>items panel</div> }),
)

vi.mock(
  "~/features/financial-movements/screens/movement-draft-detail/components/movement-evidences-panel",
  () => ({
    MovementEvidencesPanel: (props: unknown) => {
      panelMocks.evidenceProps(props)
      return <div>evidences panel</div>
    },
  }),
)

const movement: FinancialMovementDraftResponse = {
  id: "movement",
  businessId: "business",
  type: 1,
  status: 1,
  movementDate: "2026-10-20",
  description: "Venta",
  currencyCode: "PEN",
  totalAmount: 10,
  createdAt: "",
  updatedAt: "",
  version: 2,
}
const submitMovement = vi.fn().mockResolvedValue(undefined)
const returnToMovements = vi.fn()

describe("MovementDraftDetailScreen additional branches", () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
      submitMovement,
      returnToMovements,
      reloadMovement: vi.fn(),
      applyMovementSummary: vi.fn(),
      applyMovementItems: vi.fn(),
      openConfirmDialog: vi.fn(),
      closeConfirmDialog: vi.fn(),
      confirmMovement: vi.fn(),
    })
  })

  it("submits the edited header and returns to read-only mode", async () => {
    render(<MovementDraftDetailScreen />)
    fireEvent.click(screen.getByRole("button", { name: "Editar cabecera" }))
    expect(screen.getByText("editing")).toBeInTheDocument()
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "submit header" }))
    })
    expect(submitMovement).toHaveBeenCalledWith(componentMocks.submittedValues)
    expect(screen.getByText("readonly")).toBeInTheDocument()
  })

  it("uses the current return action from the page header", () => {
    render(<MovementDraftDetailScreen />)

    fireEvent.click(screen.getByRole("button", { name: "Volver a productos" }))

    expect(returnToMovements).toHaveBeenCalledOnce()
  })
})

describe("MovementDraftDetailScreen evidence integration", () => {
  it("passes movement identity, version and reload callback", () => {
    const reloadMovement = vi.fn().mockResolvedValue(undefined)
    vi.mocked(useMovementDraftDetail).mockReturnValue({
      movement: {
        id: "movement-id",
        businessId: "business-id",
        type: 1,
        status: 1,
        movementDate: "2026-10-21",
        description: "Venta",
        currencyCode: "PEN",
        totalAmount: 10,
        createdAt: "",
        updatedAt: "",
        version: 7,
      },
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
      reloadMovement,
      applyMovementSummary: vi.fn(),
      applyMovementItems: vi.fn(),
      openConfirmDialog: vi.fn(),
      closeConfirmDialog: vi.fn(),
      confirmMovement: vi.fn(),
    })

    render(<MovementDraftDetailScreen />)

    expect(screen.getByText("evidences panel")).toBeInTheDocument()
    expect(panelMocks.evidenceProps).toHaveBeenCalledWith(
      expect.objectContaining({
        businessId: "business-id",
        movementId: "movement-id",
        movementVersion: 7,
        onMovementChanged: reloadMovement,
      }),
    )
  })
})

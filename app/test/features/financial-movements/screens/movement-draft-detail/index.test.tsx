import { act, fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MovementDraftDetailScreen from "~/features/financial-movements/screens/movement-draft-detail"
import { useMovementDraftDetail } from "~/features/financial-movements/screens/movement-draft-detail/hooks/use-movement-draft-detail"
import type { FinancialMovementDraftResponse } from "~/services/financial-movements/interfaces"

const componentMocks = vi.hoisted(() => ({
  submittedValues: { movementDate: "2026-10-20", description: "Cabecera" },
}))

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
      canUpdate: true,
      isLoading: false,
      isSubmitting: false,
      error: "",
      submitMovement,
      returnToMovements,
      reloadMovement: vi.fn(),
      applyMovementSummary: vi.fn(),
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

  it("uses return navigation when the read-only form is cancelled", () => {
    render(<MovementDraftDetailScreen />)
    fireEvent.click(screen.getByRole("button", { name: "cancel header" }))
    expect(returnToMovements).toHaveBeenCalledOnce()
  })
})

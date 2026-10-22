import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MovementHistoryDetailScreen, {
  meta,
} from "~/features/financial-movements/screens/movement-history-detail"
import { useMovementHistoryDetail } from "~/features/financial-movements/screens/movement-history-detail/hooks/use-movement-history-detail"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"

vi.mock(
  "~/features/financial-movements/screens/movement-history-detail/hooks/use-movement-history-detail",
  () => ({ useMovementHistoryDetail: vi.fn() }),
)
vi.mock("~/features/financial-movements/screens/movement-draft-detail", () => ({
  default: () => <div>Flujo de borrador</div>,
}))

const useDetailMock = vi.mocked(useMovementHistoryDetail)
const returnToHistory = vi.fn()
const openEvidence = vi.fn()
const movement = {
  id: "movement-id",
  businessId: "business-id",
  type: 1 as const,
  status: FinancialMovementStatus.Confirmed,
  movementDate: "2026-10-05",
  description: "Venta",
  currencyCode: "PEN",
  totalAmount: 80,
  createdByUserId: "creator",
  updatedByUserId: "updater",
  confirmedByUserId: "confirmer",
  cancelledByUserId: null,
  cancellationReason: null,
  createdAt: "2026-10-05T20:00:00Z",
  updatedAt: "2026-10-05T21:00:00Z",
  confirmedAt: "2026-10-05T21:00:00Z",
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
})

describe("MovementHistoryDetailScreen", () => {
  it("defines metadata and renders loading", () => {
    expect(meta()).toEqual([{ title: "Detalle del movimiento | Mype" }])
    useDetailMock.mockReturnValue({
      movement: null,
      isLoading: true,
      error: "",
      evidenceError: "",
      openingEvidenceId: null,
      openEvidence,
      returnToHistory,
    })
    render(<MovementHistoryDetailScreen />)
    expect(screen.getByText("Cargando movimiento...")).toBeInTheDocument()
  })

  it("renders explicit and fallback errors with navigation", () => {
    useDetailMock.mockReturnValue({
      movement: null,
      isLoading: false,
      error: "No encontrado",
      evidenceError: "",
      openingEvidenceId: null,
      openEvidence,
      returnToHistory,
    })
    const { rerender } = render(<MovementHistoryDetailScreen />)
    expect(screen.getByRole("alert")).toHaveTextContent("No encontrado")
    fireEvent.click(screen.getByRole("button", { name: "Volver al historial" }))
    expect(returnToHistory).toHaveBeenCalledOnce()
    useDetailMock.mockReturnValue({
      movement: null,
      isLoading: false,
      error: "",
      evidenceError: "",
      openingEvidenceId: null,
      openEvidence,
      returnToHistory,
    })
    rerender(<MovementHistoryDetailScreen />)
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No se encontró el movimiento.",
    )
  })

  it("preserves the existing draft flow", () => {
    useDetailMock.mockReturnValue({
      movement: {
        ...movement,
        status: FinancialMovementStatus.Draft,
        isEditable: true,
      },
      isLoading: false,
      error: "",
      evidenceError: "",
      openingEvidenceId: null,
      openEvidence,
      returnToHistory,
    })
    render(<MovementHistoryDetailScreen />)
    expect(screen.getByText("Flujo de borrador")).toBeInTheDocument()
  })

  it("renders non-draft historical details", () => {
    useDetailMock.mockReturnValue({
      movement,
      isLoading: false,
      error: "",
      evidenceError: "",
      openingEvidenceId: null,
      openEvidence,
      returnToHistory,
    })
    render(<MovementHistoryDetailScreen />)
    expect(
      screen.getByRole("heading", { name: "Detalle del movimiento" }),
    ).toBeInTheDocument()
    expect(
      screen.getByText("Consulta histórica de solo lectura"),
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Ítems" })).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: "Evidencias" }),
    ).toBeInTheDocument()
  })
})

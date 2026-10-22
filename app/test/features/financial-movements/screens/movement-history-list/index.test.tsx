import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MovementHistoryListScreen, {
  meta,
} from "~/features/financial-movements/screens/movement-history-list"
import { useMovementHistory } from "~/features/financial-movements/screens/movement-history-list/hooks/use-movement-history"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"

vi.mock(
  "~/features/financial-movements/screens/movement-history-list/hooks/use-movement-history",
  () => ({ useMovementHistory: vi.fn() }),
)

const useMovementHistoryMock = vi.mocked(useMovementHistory)
const baseState = {
  movements: [],
  categories: [],
  filters: {
    type: undefined,
    status: undefined,
    dateFrom: "",
    dateTo: "",
    categoryId: "",
  },
  page: 1,
  pageSize: 20,
  totalCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  isLoading: false,
  error: "",
  setFilters: vi.fn(),
  applyFilters: vi.fn(),
  clearFilters: vi.fn(),
  goToPreviousPage: vi.fn(),
  goToNextPage: vi.fn(),
  viewMovement: vi.fn(),
  viewDrafts: vi.fn(),
  returnToDashboard: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  useMovementHistoryMock.mockReturnValue(baseState)
})

describe("MovementHistoryListScreen", () => {
  it("defines the history page title", () => {
    expect(meta()).toEqual([{ title: "Historial financiero | Mype" }])
  })

  it("renders the empty state and explicit navigation actions", () => {
    render(<MovementHistoryListScreen />)

    expect(
      screen.getByRole("heading", { name: "Historial financiero" }),
    ).toBeInTheDocument()
    expect(
      screen.getByText("No hay movimientos para mostrar"),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Volver al dashboard" }))
    fireEvent.click(screen.getByRole("button", { name: "Ver borradores" }))
    expect(baseState.returnToDashboard).toHaveBeenCalledOnce()
    expect(baseState.viewDrafts).toHaveBeenCalledOnce()
  })

  it("renders loading and error states", () => {
    useMovementHistoryMock.mockReturnValueOnce({
      ...baseState,
      isLoading: true,
    })
    const { rerender } = render(<MovementHistoryListScreen />)
    expect(screen.getByText("Cargando historial...")).toBeInTheDocument()

    useMovementHistoryMock.mockReturnValueOnce({
      ...baseState,
      error: "No fue posible cargar el historial",
    })
    rerender(<MovementHistoryListScreen />)
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No fue posible cargar el historial",
    )
  })

  it("renders movements and pagination from the hook", () => {
    useMovementHistoryMock.mockReturnValue({
      ...baseState,
      movements: [
        {
          id: "movement-id",
          type: 1,
          status: FinancialMovementStatus.Confirmed,
          movementDate: "2026-10-05",
          description: "Venta confirmada",
          currencyCode: "PEN",
          totalAmount: 80,
          activeItemCount: 2,
          hasActiveEvidence: false,
          confirmedAt: "2026-10-05T21:15:00Z",
          cancelledAt: null,
          discardedAt: null,
        },
      ],
      totalCount: 21,
      hasNextPage: true,
    })

    render(<MovementHistoryListScreen />)

    expect(
      screen.getByRole("region", { name: "Listado del historial financiero" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Venta confirmada")).toBeInTheDocument()
    expect(
      screen.getByText("Mostrando 1-20 de 21 movimientos"),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Ver detalle" }))
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))
    expect(baseState.viewMovement).toHaveBeenCalledWith("movement-id")
    expect(baseState.goToNextPage).toHaveBeenCalledOnce()
  })
})

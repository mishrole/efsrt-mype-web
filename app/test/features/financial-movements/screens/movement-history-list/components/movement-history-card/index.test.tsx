import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MovementHistoryCard } from "~/features/financial-movements/screens/movement-history-list/components/movement-history-card"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"

const movement = {
  id: "movement-id",
  type: 1 as const,
  status: FinancialMovementStatus.Confirmed,
  movementDate: "2026-10-05",
  description: "Venta del turno mañana",
  currencyCode: "PEN",
  totalAmount: 80,
  activeItemCount: 2,
  hasActiveEvidence: true,
  confirmedAt: "2026-10-05T21:15:00Z",
  cancelledAt: null,
  discardedAt: null,
}

describe("MovementHistoryCard", () => {
  it("renders movement summary and opens its detail", () => {
    const onView = vi.fn()
    render(<MovementHistoryCard movement={movement} onView={onView} />)

    expect(screen.getByText("Venta del turno mañana")).toBeInTheDocument()
    expect(screen.getByText("Confirmado")).toBeInTheDocument()
    expect(screen.getByText("Con evidencia")).toBeInTheDocument()
    expect(screen.getByText("2 ítems")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Ver detalle" }))
    expect(onView).toHaveBeenCalledWith("movement-id")
  })

  it("renders fallback content for a draft without description or evidence", () => {
    render(
      <MovementHistoryCard
        movement={{
          ...movement,
          status: FinancialMovementStatus.Draft,
          description: null,
          activeItemCount: 1,
          hasActiveEvidence: false,
          confirmedAt: null,
        }}
        onView={vi.fn()}
      />,
    )

    expect(screen.getByText("Borrador")).toBeInTheDocument()
    expect(screen.getByText("Sin descripción")).toBeInTheDocument()
    expect(screen.getByText("1 ítem")).toBeInTheDocument()
    expect(screen.queryByText("Con evidencia")).not.toBeInTheDocument()
  })

  it("renders an opening balance with its own movement type label", () => {
    render(
      <MovementHistoryCard
        movement={{
          ...movement,
          type: 3,
          description: "Saldo inicial del negocio",
        }}
        onView={vi.fn()}
      />,
    )

    expect(screen.getByText("Saldo de apertura")).toBeInTheDocument()
    expect(screen.queryByText("Gasto")).not.toBeInTheDocument()
  })
})

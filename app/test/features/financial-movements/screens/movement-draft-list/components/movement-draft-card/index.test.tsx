import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import { MovementDraftCard } from "~/features/financial-movements/screens/movement-draft-list/components/movement-draft-card"

const baseMovement = {
  id: "movement-id",
  type: FINANCIAL_MOVEMENT_TYPES.sale,
  movementDate: "2026-10-19",
  description: "Venta diaria",
  currencyCode: "PEN",
  totalAmount: 25,
  updatedAt: "2026-10-19T14:30:00Z",
  version: 3,
}

describe("MovementDraftCard", () => {
  it("renders and opens a sale", () => {
    const onView = vi.fn()
    render(<MovementDraftCard movement={baseMovement} onView={onView} />)
    expect(screen.getByText("Venta")).toBeInTheDocument()
    expect(screen.getByText("Venta diaria")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Abrir" }))
    expect(onView).toHaveBeenCalledWith("movement-id")
  })

  it("renders an expense without description", () => {
    render(
      <MovementDraftCard
        movement={{
          ...baseMovement,
          type: FINANCIAL_MOVEMENT_TYPES.expense,
          description: null,
        }}
        onView={vi.fn()}
      />,
    )
    expect(screen.getByText("Gasto")).toBeInTheDocument()
    expect(screen.getByText("Sin descripción")).toBeInTheDocument()
  })
})

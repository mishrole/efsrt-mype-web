import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ConfirmFinancialMovementDialog } from "~/features/financial-movements/components/confirm-financial-movement-dialog"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"

const baseProps = {
  isOpen: true,
  isConfirming: false,
  movementType: FINANCIAL_MOVEMENT_TYPES.sale,
  movementDate: "2026-10-21",
  totalAmount: 100,
  currencyCode: "PEN",
  itemCount: 2,
  onCancel: vi.fn(),
  onConfirm: vi.fn().mockResolvedValue(undefined),
}

describe("ConfirmFinancialMovementDialog", () => {
  it("returns null while closed", () => {
    render(<ConfirmFinancialMovementDialog {...baseProps} isOpen={false} />)
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument()
  })

  it("renders a sale summary and dispatches both actions", () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    render(
      <ConfirmFinancialMovementDialog
        {...baseProps}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )

    expect(
      screen.getByRole("heading", { name: "Confirmar venta" }),
    ).toBeInTheDocument()
    expect(screen.getByText("2026-10-21")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
    expect(screen.getByText(/dejará de ser editable/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    fireEvent.click(
      screen.getByRole("button", { name: "Confirmar movimiento" }),
    )

    expect(onCancel).toHaveBeenCalledOnce()
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it("renders the expense label", () => {
    render(
      <ConfirmFinancialMovementDialog
        {...baseProps}
        movementType={FINANCIAL_MOVEMENT_TYPES.expense}
      />,
    )
    expect(
      screen.getByRole("heading", { name: "Confirmar gasto" }),
    ).toBeInTheDocument()
  })

  it("disables confirmation without active items", () => {
    render(<ConfirmFinancialMovementDialog {...baseProps} itemCount={0} />)
    expect(
      screen.getByRole("button", { name: "Confirmar movimiento" }),
    ).toBeDisabled()
  })

  it("blocks closing and duplicate submission while confirming", () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    render(
      <ConfirmFinancialMovementDialog
        {...baseProps}
        isConfirming
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
    expect(
      screen.getByRole("button", { name: "Confirmando..." }),
    ).toBeDisabled()
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    fireEvent.click(screen.getByRole("button", { name: "Confirmando..." }))
    expect(onCancel).not.toHaveBeenCalled()
    expect(onConfirm).not.toHaveBeenCalled()
  })
})

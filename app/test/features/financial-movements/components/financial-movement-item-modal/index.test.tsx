import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FinancialMovementItemModal } from "~/features/financial-movements/components/financial-movement-item-modal"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
vi.mock("~/features/financial-movements/components/sale-item-form", () => ({
  SaleItemForm: () => <div>Sale form</div>,
}))
vi.mock("~/features/financial-movements/components/expense-item-form", () => ({
  ExpenseItemForm: () => <div>Expense form</div>,
}))
const props = {
  isOpen: true,
  item: null,
  products: [],
  categories: [],
  isSubmitting: false,
  onClose: vi.fn(),
  onSubmitSale: vi.fn(),
  onSubmitExpense: vi.fn(),
}
describe("FinancialMovementItemModal", () => {
  it("returns null when closed", () => {
    render(
      <FinancialMovementItemModal
        {...props}
        isOpen={false}
        movementType={FINANCIAL_MOVEMENT_TYPES.sale}
      />,
    )
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })
  it("renders create sale", () => {
    render(
      <FinancialMovementItemModal
        {...props}
        movementType={FINANCIAL_MOVEMENT_TYPES.sale}
      />,
    )
    expect(
      screen.getByRole("heading", { name: "Agregar producto" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Sale form")).toBeInTheDocument()
  })
  it("renders edit expense", () => {
    render(
      <FinancialMovementItemModal
        {...props}
        item={{ id: "item" } as never}
        movementType={FINANCIAL_MOVEMENT_TYPES.expense}
      />,
    )
    expect(
      screen.getByRole("heading", { name: "Editar concepto" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Expense form")).toBeInTheDocument()
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { FinancialMovementItemCard } from "~/features/financial-movements/components/financial-movement-item-card"
const item = {
  id: "item",
  categoryId: "category",
  categoryName: "Ventas",
  productId: "product",
  productCategoryId: "group",
  productName: "Gaseosa",
  description: null,
  quantity: 2,
  unitAmount: 5,
  unitCostSnapshot: 3,
  subtotalAmount: 10,
  estimatedCost: 6,
  estimatedMargin: 4,
  version: 2,
}
describe("FinancialMovementItemCard", () => {
  it("renders sale and dispatches actions", () => {
    const onEdit = vi.fn(),
      onRetire = vi.fn()
    render(
      <FinancialMovementItemCard
        item={item}
        currencyCode="PEN"
        isSale
        isBusy={false}
        onEdit={onEdit}
        onRetire={onRetire}
      />,
    )
    expect(screen.getByText("Gaseosa")).toBeInTheDocument()
    expect(screen.getByText(/Margen/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /Editar/ }))
    fireEvent.click(screen.getByRole("button", { name: /Retirar/ }))
    expect(onEdit).toHaveBeenCalledWith(item)
    expect(onRetire).toHaveBeenCalledWith(item)
  })
  it("renders expense and busy state", () => {
    render(
      <FinancialMovementItemCard
        item={{
          ...item,
          productName: null,
          description: "Taxi",
          estimatedMargin: null,
        }}
        currencyCode="PEN"
        isSale={false}
        isBusy
        onEdit={vi.fn()}
        onRetire={vi.fn()}
      />,
    )
    expect(screen.getByText("Taxi")).toBeInTheDocument()
    expect(screen.queryByText(/Margen/)).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Editar/ })).toBeDisabled()
  })
})

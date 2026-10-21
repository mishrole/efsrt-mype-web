import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { SaleItemForm } from "~/features/financial-movements/components/sale-item-form"
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
const products = [
  {
    id: "product",
    businessId: "business",
    categoryId: "category",
    categoryName: "Ventas",
    productCategoryId: "group",
    productCategoryName: "Bebidas",
    productCategoryColor: "#000",
    name: "Gaseosa",
    salePrice: 5,
    unitCost: 3,
    isActive: true,
  },
]
describe("SaleItemForm", () => {
  it("creates with validated values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <SaleItemForm
        products={products}
        item={null}
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole("combobox", { name: "Producto" }))
    fireEvent.click(await screen.findByRole("option", { name: "Gaseosa" }))
    fireEvent.change(screen.getByLabelText("Cantidad"), {
      target: { value: "2" },
    })
    fireEvent.change(screen.getByLabelText("Importe unitario"), {
      target: { value: "5" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Agregar producto" }))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { productId: "product", quantity: 2, unitAmount: 5 },
        expect.anything(),
      ),
    )
  })
  it("loads edit defaults and exposes cancel", () => {
    const onCancel = vi.fn()
    render(
      <SaleItemForm
        products={products}
        item={item}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    )
    expect(screen.getByLabelText("Cantidad")).toHaveValue(2)
    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    expect(onCancel).toHaveBeenCalledOnce()
  })
  it("disables fields while submitting", () => {
    render(
      <SaleItemForm
        products={products}
        item={null}
        isSubmitting
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled()
    expect(screen.getByLabelText("Producto")).toBeDisabled()
  })
  it("shows validation errors", async () => {
    render(
      <SaleItemForm
        products={[]}
        item={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    fireEvent.change(screen.getByLabelText("Cantidad"), {
      target: { value: "0" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Agregar producto" }))
    expect(
      await screen.findByText("El producto es obligatorio."),
    ).toBeInTheDocument()
    expect(
      screen.getByText("La cantidad debe ser mayor que cero."),
    ).toBeInTheDocument()
  })
})

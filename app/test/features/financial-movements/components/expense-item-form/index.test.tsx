import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ExpenseItemForm } from "~/features/financial-movements/components/expense-item-form"
const item = {
  id: "item",
  categoryId: "category",
  categoryName: "Movilidad",
  productId: null,
  productCategoryId: null,
  productName: null,
  description: "Taxi",
  quantity: 2,
  unitAmount: 25,
  unitCostSnapshot: null,
  subtotalAmount: 50,
  estimatedCost: null,
  estimatedMargin: null,
  version: 1,
}
const categories = [
  {
    id: "category",
    businessId: "business",
    name: "Movilidad",
    type: 2,
    isActive: true,
  },
]
describe("ExpenseItemForm", () => {
  it("creates with validated values", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <ExpenseItemForm
        categories={categories as never}
        item={null}
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )
    fireEvent.click(
      screen.getByRole("combobox", { name: "Categoría de gasto" }),
    )
    fireEvent.click(await screen.findByRole("option", { name: "Movilidad" }))
    fireEvent.change(screen.getByLabelText("Descripción"), {
      target: { value: "Taxi" },
    })
    fireEvent.change(screen.getByLabelText("Cantidad"), {
      target: { value: "2" },
    })
    fireEvent.change(screen.getByLabelText("Importe unitario"), {
      target: { value: "25" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Agregar concepto" }))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          categoryId: "category",
          description: "Taxi",
          quantity: 2,
          unitAmount: 25,
        },
        expect.anything(),
      ),
    )
  })
  it("loads edit defaults and exposes cancel", () => {
    const onCancel = vi.fn()
    render(
      <ExpenseItemForm
        categories={categories as never}
        item={item}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    )
    expect(screen.getByLabelText("Descripción")).toHaveValue("Taxi")
    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    expect(onCancel).toHaveBeenCalledOnce()
  })
  it("disables fields while submitting", () => {
    render(
      <ExpenseItemForm
        categories={categories as never}
        item={null}
        isSubmitting
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled()
    expect(screen.getByLabelText("Descripción")).toBeDisabled()
  })
  it("shows validation errors", async () => {
    render(
      <ExpenseItemForm
        categories={[]}
        item={null}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByRole("button", { name: "Agregar concepto" }))
    expect(
      await screen.findByText("La categoría es obligatoria."),
    ).toBeInTheDocument()
    expect(
      screen.getByText("La descripción es obligatoria."),
    ).toBeInTheDocument()
  })
})

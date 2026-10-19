import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProductForm } from "~/features/products/screens/product-create/components/product-form"
import { CategoryType } from "~/services/categories/interfaces"

const categories = [
  {
    id: "category-id",
    businessId: "business-id",
    name: "Bebidas",
    type: CategoryType.Sale,
    isDefault: false,
    isActive: true,
  },
]

describe("ProductForm", () => {
  it("submits a valid product", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <ProductForm
        categories={categories}
        isSubmitting={false}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Gaseosa" },
    })
    fireEvent.click(screen.getByLabelText("Categoría"))
    const option = screen.getByText("Bebidas")
    fireEvent.pointerDown(option)
    fireEvent.click(option)
    fireEvent.change(screen.getByLabelText("Precio de venta"), {
      target: { value: "3.50" },
    })
    fireEvent.change(screen.getByLabelText("Coste unitario referencial"), {
      target: { value: "2.20" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Crear producto" }))

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Gaseosa",
        categoryId: "category-id",
        salePrice: 3.5,
        unitCost: 2.2,
      }),
    )
  })

  it("shows validation errors and cancels", async () => {
    const onCancel = vi.fn()
    render(
      <ProductForm
        categories={categories}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    )

    fireEvent.change(screen.getByLabelText("Precio de venta"), {
      target: { value: "-1" },
    })
    fireEvent.change(screen.getByLabelText("Coste unitario referencial"), {
      target: { value: "-1" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Crear producto" }))

    expect(
      await screen.findByText("El nombre es obligatorio."),
    ).toBeInTheDocument()
    expect(screen.getByText("La categoría es obligatoria.")).toBeInTheDocument()
    expect(
      screen.getByText("El precio de venta no puede ser negativo."),
    ).toBeInTheDocument()
    expect(
      screen.getByText("El coste unitario no puede ser negativo."),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it("disables actions while submitting", () => {
    render(
      <ProductForm
        categories={categories}
        isSubmitting
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
  })
})

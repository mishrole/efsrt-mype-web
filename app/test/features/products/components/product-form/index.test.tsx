import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { ProductForm } from "~/features/products/components/product-form"
import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"

const selectMockState = vi.hoisted(() => ({
  onValueChange: null as ((value: string | null) => void) | null,
}))

vi.mock("~/shared/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: ReactNode
    onValueChange: (value: string | null) => void
  }) => {
    selectMockState.onValueChange = onValueChange

    return (
      <div>
        {children}
        <button
          type="button"
          onClick={() => selectMockState.onValueChange?.(null)}
        >
          Limpiar categoría simulada
        </button>
      </div>
    )
  },
  SelectTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => (
    <span>{placeholder}</span>
  ),
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children, value }: { children: ReactNode; value: string }) => (
    <button
      type="button"
      onClick={() => selectMockState.onValueChange?.(value)}
    >
      {children}
    </button>
  ),
}))

const productCategories: ProductCategoryResponse[] = [
  {
    id: "product-category-id",
    businessId: "business-id",
    name: "Bebidas",
    color: "#3F6FC4",
    isDefault: false,
    isActive: true,
    deactivatedAt: null,
    createdAt: "2026-10-18T05:00:00Z",
    updatedAt: "2026-10-18T05:00:00Z",
    version: 1,
  },
]

describe("ProductForm", () => {
  it("submits valid default values and ignores the event argument", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    const { container } = render(
      <ProductForm
        productCategories={productCategories}
        defaultValues={{
          name: "Gaseosa",
          productCategoryId: "product-category-id",
          salePrice: 3.5,
          unitCost: 2.25,
        }}
        isSubmitting={false}
        submitLabel="Crear producto"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )

    const productForm = container.querySelector("form")

    if (!productForm) {
      throw new Error("Product form was not found")
    }

    fireEvent.submit(productForm)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce()
    })

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      name: "Gaseosa",
      productCategoryId: "product-category-id",
      salePrice: 3.5,
      unitCost: 2.25,
    })
  })

  it("selects a category and submits values entered by the user", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    const { container } = render(
      <ProductForm
        productCategories={productCategories}
        isSubmitting={false}
        submitLabel="Crear producto"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Agua mineral" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Bebidas" }))
    fireEvent.change(screen.getByLabelText("Precio de venta"), {
      target: { value: "2.50" },
    })
    fireEvent.change(screen.getByLabelText("Coste unitario referencial"), {
      target: { value: "1.25" },
    })

    const productForm = container.querySelector("form")

    if (!productForm) {
      throw new Error("Product form was not found")
    }

    fireEvent.submit(productForm)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledOnce()
    })

    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      name: "Agua mineral",
      productCategoryId: "product-category-id",
      salePrice: 2.5,
      unitCost: 1.25,
    })
  })

  it("ignores a null category selection and displays validation errors", async () => {
    const onSubmit = vi.fn()

    const { container } = render(
      <ProductForm
        productCategories={productCategories}
        isSubmitting={false}
        submitLabel="Crear producto"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )

    fireEvent.click(
      screen.getByRole("button", { name: "Limpiar categoría simulada" }),
    )

    const productForm = container.querySelector("form")

    if (!productForm) {
      throw new Error("Product form was not found")
    }

    fireEvent.submit(productForm)

    expect(
      await screen.findByText("El nombre es obligatorio."),
    ).toBeInTheDocument()
    expect(
      screen.getByText("La categoría de producto es obligatoria."),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it("cancels and supports read-only detail", () => {
    const onCancel = vi.fn()
    const { rerender } = render(
      <ProductForm
        productCategories={productCategories}
        isSubmitting={false}
        submitLabel="Guardar cambios"
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    expect(onCancel).toHaveBeenCalledOnce()

    rerender(
      <ProductForm
        productCategories={productCategories}
        defaultValues={{
          name: "Gaseosa",
          productCategoryId: "product-category-id",
          salePrice: 3.5,
          unitCost: 2.25,
        }}
        isSubmitting={false}
        isReadOnly
        submitLabel="Guardar cambios"
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    )

    expect(
      screen.queryByRole("button", { name: "Guardar cambios" }),
    ).not.toBeInTheDocument()
    expect(screen.getByLabelText("Nombre")).toBeDisabled()
    expect(screen.getByLabelText("Precio de venta")).toBeDisabled()
    expect(screen.getByLabelText("Coste unitario referencial")).toBeDisabled()
  })

  it("disables form actions while submitting", () => {
    render(
      <ProductForm
        productCategories={productCategories}
        isSubmitting
        submitLabel="Guardar cambios"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled()
  })
})

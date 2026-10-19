import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { ProductForm } from "~/features/products/components/product-form"
import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"

interface ComboboxItem {
  label: string
  value: string
}

const comboboxState = vi.hoisted(() => ({
  items: [] as ComboboxItem[],
  value: null as ComboboxItem | null,
  onValueChange: null as ((item: ComboboxItem | null) => void) | null,
}))

vi.mock("~/shared/components/ui/combobox", () => ({
  Combobox: ({
    children,
    items,
    value,
    onValueChange,
  }: {
    children: ReactNode
    items: ComboboxItem[]
    value: ComboboxItem | null
    onValueChange: (item: ComboboxItem | null) => void
  }) => {
    comboboxState.items = items
    comboboxState.value = value
    comboboxState.onValueChange = onValueChange
    return <div>{children}</div>
  },
  ComboboxInput: ({
    placeholder,
    "aria-label": ariaLabel,
  }: {
    placeholder: string
    "aria-label": string
  }) => (
    <input
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={comboboxState.value?.label ?? ""}
      readOnly
    />
  ),
  ComboboxContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ComboboxEmpty: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ComboboxList: ({
    children,
  }: {
    children: (item: ComboboxItem) => ReactNode
  }) => <div>{comboboxState.items.map(children)}</div>,
  ComboboxItem: ({
    children,
    value,
  }: {
    children: ReactNode
    value: ComboboxItem
  }) => (
    <button type="button" onClick={() => comboboxState.onValueChange?.(value)}>
      {children}
    </button>
  ),
}))

const productCategories: ProductCategoryResponse[] = [
  {
    id: "beverages-id",
    businessId: "business-id",
    name: "Bebidas",
    color: "#3F6FC4",
    isDefault: false,
    isActive: true,
    deactivatedAt: null,
    createdAt: "",
    updatedAt: "",
    version: 1,
  },
  {
    id: "desserts-id",
    businessId: "business-id",
    name: "Postres",
    color: "#6751C3",
    isDefault: false,
    isActive: true,
    deactivatedAt: null,
    createdAt: "",
    updatedAt: "",
    version: 1,
  },
]

describe("ProductForm category combobox", () => {
  it("maps categories to label and value and displays the label", () => {
    render(
      <ProductForm
        productCategories={productCategories}
        defaultValues={{
          name: "Gaseosa",
          productCategoryId: "beverages-id",
          salePrice: 3.5,
          unitCost: 2.25,
        }}
        isSubmitting={false}
        submitLabel="Guardar cambios"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(comboboxState.items).toEqual([
      { label: "Bebidas", value: "beverages-id" },
      { label: "Postres", value: "desserts-id" },
    ])
    expect(screen.getByLabelText("Categoría de producto")).toHaveValue(
      "Bebidas",
    )
    expect(screen.getByLabelText("Categoría de producto")).not.toHaveValue(
      "beverages-id",
    )
  })

  it("stores only the selected id in the submitted form", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const { container } = render(
      <ProductForm
        productCategories={productCategories}
        defaultValues={{
          name: "Torta",
          productCategoryId: "",
          salePrice: 12.5,
          unitCost: 7.25,
        }}
        isSubmitting={false}
        submitLabel="Crear producto"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Postres" }))
    const form = container.querySelector("form")
    if (!form) {
      throw new Error("Product form was not found")
    }
    fireEvent.submit(form)

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      name: "Torta",
      productCategoryId: "desserts-id",
      salePrice: 12.5,
      unitCost: 7.25,
    })
  })

  it("clears the selected id", async () => {
    const { container } = render(
      <ProductForm
        productCategories={productCategories}
        defaultValues={{
          name: "Gaseosa",
          productCategoryId: "beverages-id",
          salePrice: 3.5,
          unitCost: 2.25,
        }}
        isSubmitting={false}
        submitLabel="Guardar cambios"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    comboboxState.onValueChange?.(null)
    const form = container.querySelector("form")
    if (!form) {
      throw new Error("Product form was not found")
    }
    fireEvent.submit(form)
    expect(
      await screen.findByText("La categoría de producto es obligatoria."),
    ).toBeInTheDocument()
  })
})

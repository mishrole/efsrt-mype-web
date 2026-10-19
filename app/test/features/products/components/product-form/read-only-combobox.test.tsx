import { render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { ProductForm } from "~/features/products/components/product-form"
import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"

vi.mock("~/shared/components/ui/combobox", () => ({
  Combobox: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  ComboboxInput: ({
    disabled,
    showTrigger,
    showClear,
    "aria-label": ariaLabel,
  }: {
    disabled?: boolean
    showTrigger?: boolean
    showClear?: boolean
    "aria-label": string
  }) => (
    <input
      aria-label={ariaLabel}
      disabled={disabled}
      data-show-trigger={String(showTrigger)}
      data-show-clear={String(showClear)}
    />
  ),
  ComboboxContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ComboboxEmpty: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ComboboxList: () => null,
  ComboboxItem: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
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
    createdAt: "",
    updatedAt: "",
    version: 1,
  },
]

describe("ProductForm category read-only state", () => {
  it("disables category input and hides its actions in read-only mode", () => {
    render(
      <ProductForm
        productCategories={productCategories}
        isSubmitting={false}
        isReadOnly
        submitLabel="Guardar cambios"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    const categoryInput = screen.getByLabelText("Categoría de producto")
    expect(categoryInput).toBeDisabled()
    expect(categoryInput).toHaveAttribute("data-show-trigger", "false")
    expect(categoryInput).toHaveAttribute("data-show-clear", "false")
  })

  it("enables category input and actions in edit mode", () => {
    render(
      <ProductForm
        productCategories={productCategories}
        isSubmitting={false}
        submitLabel="Guardar cambios"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    const categoryInput = screen.getByLabelText("Categoría de producto")
    expect(categoryInput).toBeEnabled()
    expect(categoryInput).toHaveAttribute("data-show-trigger", "true")
    expect(categoryInput).toHaveAttribute("data-show-clear", "true")
  })
})

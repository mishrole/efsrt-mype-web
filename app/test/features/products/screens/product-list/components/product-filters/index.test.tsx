import { fireEvent, render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { ProductFilters } from "~/features/products/screens/product-list/components/product-filters"
import type { ProductFilterValues } from "~/features/products/screens/product-list/components/product-filters/interfaces"

const selectCallbacks = vi.hoisted(
  () => [] as Array<(value: string | null) => void>,
)

vi.mock("~/shared/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: ReactNode
    onValueChange: (value: string | null) => void
  }) => {
    const callbackIndex = selectCallbacks.length
    selectCallbacks.push(onValueChange)
    return <div data-testid={`select-${callbackIndex}`}>{children}</div>
  },
  SelectTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: () => <span />,
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: { children: ReactNode }) => (
    <span>{children}</span>
  ),
}))

const values: ProductFilterValues = {
  search: "",
  productCategoryId: "all",
  status: "all",
}

const productCategories = [
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

describe("ProductFilters", () => {
  it("changes every filter, ignores null selections, applies and clears", () => {
    selectCallbacks.length = 0
    const onChange = vi.fn()
    const onApply = vi.fn()
    const onClear = vi.fn()

    render(
      <ProductFilters
        productCategories={productCategories}
        values={values}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />,
    )

    fireEvent.change(screen.getByLabelText("Buscar productos"), {
      target: { value: "gaseosa" },
    })
    selectCallbacks[0]?.("product-category-id")
    selectCallbacks[0]?.(null)
    selectCallbacks[1]?.("inactive")
    selectCallbacks[1]?.(null)
    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }))
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }))

    expect(onChange).toHaveBeenNthCalledWith(1, {
      ...values,
      search: "gaseosa",
    })
    expect(onChange).toHaveBeenNthCalledWith(2, {
      ...values,
      productCategoryId: "product-category-id",
    })
    expect(onChange).toHaveBeenNthCalledWith(3, {
      ...values,
      status: "inactive",
    })
    expect(onChange).toHaveBeenCalledTimes(3)
    expect(onApply).toHaveBeenCalledOnce()
    expect(onClear).toHaveBeenCalledOnce()
  })

  it("disables all controls", () => {
    selectCallbacks.length = 0
    render(
      <ProductFilters
        productCategories={productCategories}
        values={values}
        disabled
        onChange={vi.fn()}
        onApply={vi.fn()}
        onClear={vi.fn()}
      />,
    )

    expect(screen.getByLabelText("Buscar productos")).toBeDisabled()
    expect(screen.getByRole("button", { name: "Aplicar" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Limpiar" })).toBeDisabled()
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"
import { ProductCategoryFilters } from "~/features/product-categories/screens/product-category-list/components/product-category-filters"
const callbacks = vi.hoisted(() => [] as Array<(value: string | null) => void>)
vi.mock("~/shared/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: ReactNode
    onValueChange: (value: string | null) => void
  }) => {
    callbacks.push(onValueChange)
    return <div>{children}</div>
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
describe("ProductCategoryFilters", () => {
  it("changes search and status, applies and clears", () => {
    callbacks.length = 0
    const onChange = vi.fn()
    const onApply = vi.fn()
    const onClear = vi.fn()
    render(
      <ProductCategoryFilters
        values={{ search: "", status: "all" }}
        disabled={false}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />,
    )
    fireEvent.change(screen.getByLabelText("Buscar categorías de producto"), {
      target: { value: "beb" },
    })
    callbacks[0]?.("inactive")
    callbacks[0]?.(null)
    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }))
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }))
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onApply).toHaveBeenCalledOnce()
    expect(onClear).toHaveBeenCalledOnce()
  })
})

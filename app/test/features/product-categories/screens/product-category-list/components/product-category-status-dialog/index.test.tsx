import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProductCategoryStatusDialog } from "~/features/product-categories/screens/product-category-list/components/product-category-status-dialog"
const category = {
  id: "category-id",
  businessId: "business-id",
  name: "Bebidas",
  color: "#3F6FC4",
  isDefault: false,
  isActive: true,
  deactivatedAt: null,
  createdAt: "",
  updatedAt: "",
  version: 1,
}
describe("ProductCategoryStatusDialog", () => {
  it("renders closed without category", () => {
    render(
      <ProductCategoryStatusDialog
        category={null}
        isSubmitting={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )
    expect(screen.queryByText(/Desactivar categoría/)).not.toBeInTheDocument()
  })
  it("confirms deactivation and renders reactivation state", () => {
    const onConfirm = vi.fn()
    const { rerender } = render(
      <ProductCategoryStatusDialog
        category={category}
        isSubmitting={false}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    )
    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }))
    expect(onConfirm).toHaveBeenCalledOnce()
    rerender(
      <ProductCategoryStatusDialog
        category={{ ...category, isActive: false }}
        isSubmitting
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    )
    expect(screen.getByText(/Reactivar categoría/)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Procesando..." })).toBeDisabled()
  })
})

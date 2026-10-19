import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProductCategoryCard } from "~/features/product-categories/screens/product-category-list/components/product-category-card"
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
describe("ProductCategoryCard", () => {
  it("edits and requests deactivation", () => {
    const onEdit = vi.fn()
    const onRequestStatusChange = vi.fn()
    render(
      <ProductCategoryCard
        category={category}
        canUpdate
        canChangeStatus
        isChangingStatus={false}
        onEdit={onEdit}
        onRequestStatusChange={onRequestStatusChange}
      />,
    )
    expect(screen.getByText("Activa")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /Editar/ }))
    fireEvent.click(screen.getByRole("button", { name: /Desactivar/ }))
    expect(onEdit).toHaveBeenCalledWith("category-id")
    expect(onRequestStatusChange).toHaveBeenCalledWith(category)
  })
  it("renders inactive default without status action", () => {
    render(
      <ProductCategoryCard
        category={{ ...category, isActive: false, isDefault: true }}
        canUpdate={false}
        canChangeStatus
        isChangingStatus
        onEdit={vi.fn()}
        onRequestStatusChange={vi.fn()}
      />,
    )
    expect(screen.getByText("Inactiva")).toBeInTheDocument()
    expect(screen.getByText("Predeterminada")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /Reactivar/ }),
    ).not.toBeInTheDocument()
  })
})

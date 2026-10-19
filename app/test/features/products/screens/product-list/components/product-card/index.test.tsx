import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProductCard } from "~/features/products/screens/product-list/components/product-card"
import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"

const product: ProductListItemResponse = {
  id: "product-id",
  businessId: "business-id",
  categoryId: "category-id",
  categoryName: "Productos",
  productCategoryId: "product-category-id",
  productCategoryName: "Bebidas",
  productCategoryColor: "#3F6FC4",
  name: "Gaseosa",
  salePrice: 3.5,
  unitCost: 2.2,
  isActive: true,
}

describe("ProductCard", () => {
  it("renders product information and opens detail", () => {
    const onView = vi.fn()

    render(
      <ProductCard
        product={product}
        currencyCode="PEN"
        canChangeStatus
        isChangingStatus={false}
        onView={onView}
        onRequestStatusChange={vi.fn()}
      />,
    )

    expect(screen.getByText("Bebidas")).toBeInTheDocument()
    expect(screen.getByText("Activo")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Ver detalle" }))
    expect(onView).toHaveBeenCalledWith("product-id")
  })

  it("requests deactivation or reactivation", () => {
    const onRequestStatusChange = vi.fn()
    const { rerender } = render(
      <ProductCard
        product={product}
        currencyCode="PEN"
        canChangeStatus
        isChangingStatus={false}
        onView={vi.fn()}
        onRequestStatusChange={onRequestStatusChange}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }))
    expect(onRequestStatusChange).toHaveBeenCalledWith(product)

    rerender(
      <ProductCard
        product={{ ...product, isActive: false }}
        currencyCode="PEN"
        canChangeStatus
        isChangingStatus={false}
        onView={vi.fn()}
        onRequestStatusChange={onRequestStatusChange}
      />,
    )
    expect(
      screen.getByRole("button", { name: "Reactivar" }),
    ).toBeInTheDocument()
  })
})

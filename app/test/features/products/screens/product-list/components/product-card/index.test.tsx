import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProductCard } from "~/features/products/screens/product-list/components/product-card"

const product = {
  id: "product-id",
  businessId: "business-id",
  categoryId: "category-id",
  categoryName: "Bebidas",
  name: "Gaseosa 500 ml",
  salePrice: 3.5,
  unitCost: 2.2,
  isActive: true,
}

describe("ProductCard", () => {
  it("renders the product and opens its detail", () => {
    const onView = vi.fn()
    render(<ProductCard product={product} currencyCode="PEN" onView={onView} />)

    expect(screen.getByText(product.name)).toBeInTheDocument()
    expect(screen.getByText(product.categoryName)).toBeInTheDocument()
    expect(screen.getByText("Activo")).toBeInTheDocument()
    expect(screen.getByText("Coste referencial")).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText(`Ver ${product.name}`))
    expect(onView).toHaveBeenCalledWith(product.id)
  })

  it("renders an inactive product", () => {
    render(
      <ProductCard
        product={{ ...product, isActive: false }}
        currencyCode="USD"
        onView={vi.fn()}
      />,
    )
    expect(screen.getByText("Inactivo")).toBeInTheDocument()
  })
})

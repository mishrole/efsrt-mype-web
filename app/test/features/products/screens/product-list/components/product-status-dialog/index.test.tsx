import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProductStatusDialog } from "~/features/products/screens/product-list/components/product-status-dialog"
import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"

const activeProduct: ProductListItemResponse = {
  id: "product-id",
  businessId: "business-id",
  categoryId: "financial-category-id",
  categoryName: "Productos",
  productCategoryId: "product-category-id",
  productCategoryName: "Bebidas",
  productCategoryColor: "#3F6FC4",
  name: "Gaseosa",
  salePrice: 3.5,
  unitCost: 2.25,
  isActive: true,
}

describe("ProductStatusDialog", () => {
  it("renders closed without a product", () => {
    render(
      <ProductStatusDialog
        product={null}
        isSubmitting={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )

    expect(screen.queryByText("Desactivar producto")).not.toBeInTheDocument()
  })

  it("confirms product deactivation", () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)

    render(
      <ProductStatusDialog
        product={activeProduct}
        isSubmitting={false}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    )

    expect(screen.getByText("Desactivar producto")).toBeInTheDocument()
    expect(screen.getByText(/Gaseosa/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Desactivar" }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it("renders reactivation and submitting states", () => {
    render(
      <ProductStatusDialog
        product={{ ...activeProduct, isActive: false }}
        isSubmitting
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    )

    expect(screen.getByText("Reactivar producto")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Procesando..." })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
  })
})

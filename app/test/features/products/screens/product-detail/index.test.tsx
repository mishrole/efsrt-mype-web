import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ProductDetailScreen, {
  meta,
} from "~/features/products/screens/product-detail"
import { useProductDetail } from "~/features/products/screens/product-detail/hooks/use-product-detail"
import type { UseProductDetailResult } from "~/features/products/screens/product-detail/hooks/use-product-detail/interfaces"

vi.mock(
  "~/features/products/screens/product-detail/hooks/use-product-detail",
  () => ({ useProductDetail: vi.fn() }),
)
const useProductDetailMock = vi.mocked(useProductDetail)
const submitProduct = vi.fn().mockResolvedValue(undefined)
const returnToProducts = vi.fn()
const productCategory = {
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
}
const product = {
  id: "product-id",
  businessId: "business-id",
  categoryId: "financial-category-id",
  categoryName: "Productos",
  categoryType: 1,
  productCategoryId: "product-category-id",
  productCategoryName: "Bebidas",
  productCategoryColor: "#3F6FC4",
  name: "Gaseosa",
  salePrice: 3.5,
  unitCost: 2.25,
  isActive: true,
  createdAt: "",
  updatedAt: "",
  version: 1,
}
const defaultState: UseProductDetailResult = {
  product,
  productCategories: [productCategory],
  canUpdate: true,
  isLoading: false,
  isSubmitting: false,
  error: "",
  categoriesError: "",
  submitProduct,
  reloadProduct: vi.fn(),
  returnToProducts,
}

describe("ProductDetailScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProductDetailMock.mockReturnValue(defaultState)
  })

  it("returns metadata and loading state", () => {
    expect(meta()).toEqual([{ title: "Detalle de producto | Mype" }])
    useProductDetailMock.mockReturnValue({
      ...defaultState,
      product: null,
      isLoading: true,
    })
    render(<ProductDetailScreen />)
    expect(screen.getByText("Cargando producto...")).toBeInTheDocument()
  })

  it("loads the current category in read-only detail", () => {
    render(<ProductDetailScreen />)
    expect(screen.getByLabelText("Categoría de producto")).toHaveValue(
      "Bebidas",
    )
    expect(
      screen.getByRole("button", { name: "Editar producto" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Guardar cambios" }),
    ).not.toBeInTheDocument()
  })

  it("enters edit mode and cancels editing", () => {
    render(<ProductDetailScreen />)
    fireEvent.click(screen.getByRole("button", { name: "Editar producto" }))
    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Editar producto" }),
    ).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))
    expect(
      screen.getByRole("button", { name: "Editar producto" }),
    ).toBeInTheDocument()
  })

  it("submits changes and returns to detail mode", async () => {
    render(<ProductDetailScreen />)
    fireEvent.click(screen.getByRole("button", { name: "Editar producto" }))
    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }))
    await waitFor(() => expect(submitProduct).toHaveBeenCalledOnce())
    expect(
      screen.getByRole("button", { name: "Editar producto" }),
    ).toBeInTheDocument()
  })

  it("does not expose editing without update permission", () => {
    useProductDetailMock.mockReturnValue({ ...defaultState, canUpdate: false })

    render(<ProductDetailScreen />)

    expect(
      screen.queryByRole("button", { name: "Editar producto" }),
    ).not.toBeInTheDocument()
  })

  it("keeps edit available when categories report an error", () => {
    useProductDetailMock.mockReturnValue({
      ...defaultState,
      categoriesError: "No fue posible cargar categorías",
    })

    render(<ProductDetailScreen />)

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No fue posible cargar categorías",
    )
    expect(
      screen.getByRole("button", { name: "Editar producto" }),
    ).toBeInTheDocument()
  })

  it("renders the fallback description without a product", () => {
    useProductDetailMock.mockReturnValue({ ...defaultState, product: null })

    render(<ProductDetailScreen />)

    expect(
      screen.getByText("Consulta la información de este producto."),
    ).toBeInTheDocument()
  })

  it("renders the product error", () => {
    useProductDetailMock.mockReturnValue({
      ...defaultState,
      error: "No fue posible cargar el producto.",
    })

    render(<ProductDetailScreen />)

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No fue posible cargar el producto.",
    )
  })

  it("returns to products from read-only cancel", () => {
    render(<ProductDetailScreen />)

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(returnToProducts).toHaveBeenCalledOnce()
  })
})

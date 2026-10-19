import { render, screen } from "@testing-library/react"
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
  productCategories: [],
  canUpdate: true,
  isLoading: false,
  isSubmitting: false,
  error: "",
  categoriesError: "",
  submitProduct: vi.fn(),
  reloadProduct: vi.fn(),
  returnToProducts: vi.fn(),
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
  it("renders product and both errors in read-only mode", () => {
    useProductDetailMock.mockReturnValue({
      ...defaultState,
      error: "Error de producto",
      categoriesError: "Error de categorías",
    })

    render(<ProductDetailScreen />)

    expect(screen.getByText(/Gaseosa/)).toBeInTheDocument()
    expect(screen.getAllByRole("alert")).toHaveLength(2)
    expect(
      screen.queryByRole("button", { name: "Guardar cambios" }),
    ).not.toBeInTheDocument()
    expect(screen.getByLabelText("Nombre")).toBeDisabled()
  })

  it("renders the update action when categories load successfully", () => {
    render(<ProductDetailScreen />)

    expect(
      screen.getByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument()
  })
  it("renders read-only when update is unavailable", () => {
    useProductDetailMock.mockReturnValue({ ...defaultState, canUpdate: false })
    render(<ProductDetailScreen />)
    expect(
      screen.queryByRole("button", { name: "Guardar cambios" }),
    ).not.toBeInTheDocument()
  })
})

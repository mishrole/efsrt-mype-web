import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ProductListScreen, {
  meta,
} from "~/features/products/screens/product-list"
import { PRODUCT_STATUS_FILTERS } from "~/features/products/constants"
import { useProducts } from "~/features/products/screens/product-list/hooks/use-products"

const createProduct = vi.fn()
const viewProduct = vi.fn()
const useProductsMock = vi.mocked(useProducts)

vi.mock("~/features/products/screens/product-list/hooks/use-products", () => ({
  useProducts: vi.fn(),
}))

const defaultState = {
  products: [
    {
      id: "product-id",
      businessId: "business-id",
      categoryId: "category-id",
      categoryName: "Bebidas",
      name: "Gaseosa 500 ml",
      salePrice: 3.5,
      unitCost: 2.2,
      isActive: true,
    },
  ],
  categories: [],
  filters: {
    search: "",
    categoryId: "all",
    status: PRODUCT_STATUS_FILTERS.all,
  },
  currencyCode: "PEN",
  canCreate: true,
  isLoading: false,
  error: "",
  setFilters: vi.fn(),
  applyFilters: vi.fn(),
  clearFilters: vi.fn(),
  viewProduct,
  createProduct,
}

describe("ProductListScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProductsMock.mockReturnValue(defaultState)
  })

  it("defines metadata and renders the products", () => {
    expect(meta()).toEqual([{ title: "Productos | Mype" }])
    render(<ProductListScreen />)

    expect(
      screen.getByRole("heading", { name: "Productos" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Gaseosa 500 ml")).toBeInTheDocument()

    fireEvent.click(screen.getByText("Nuevo producto"))
    expect(createProduct).toHaveBeenCalledOnce()
  })

  it("renders loading, error and empty states", () => {
    useProductsMock.mockReturnValue({
      ...defaultState,
      products: [],
      canCreate: false,
      isLoading: true,
      error: "",
    })

    const { rerender } = render(<ProductListScreen />)
    expect(screen.getByText("Cargando productos...")).toBeInTheDocument()
    expect(screen.queryByText("Nuevo producto")).not.toBeInTheDocument()

    useProductsMock.mockReturnValue({
      ...defaultState,
      products: [],
      isLoading: false,
      error: "No fue posible cargar los productos.",
    })
    rerender(<ProductListScreen />)
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No fue posible cargar los productos.",
    )

    useProductsMock.mockReturnValue({
      ...defaultState,
      products: [],
      isLoading: false,
      error: "",
    })
    rerender(<ProductListScreen />)
    expect(screen.getByText("No se encontraron productos")).toBeInTheDocument()
  })
})

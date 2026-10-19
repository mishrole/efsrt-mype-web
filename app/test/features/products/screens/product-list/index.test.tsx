import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ProductListScreen, {
  meta,
} from "~/features/products/screens/product-list"
import { useProducts } from "~/features/products/screens/product-list/hooks/use-products"
import type { UseProductsResult } from "~/features/products/screens/product-list/hooks/use-products/interfaces"

vi.mock("~/features/products/screens/product-list/hooks/use-products", () => ({
  useProducts: vi.fn(),
}))

const useProductsMock = vi.mocked(useProducts)
const activeProduct = {
  id: "active-product-id",
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
const inactiveProduct = {
  ...activeProduct,
  id: "inactive-product-id",
  name: "Agua",
  isActive: false,
}
const defaultState: UseProductsResult = {
  products: [],
  productCategories: [],
  filters: { search: "", productCategoryId: "all", status: "all" },
  pendingStatusProduct: null,
  currencyCode: "PEN",
  canCreate: true,
  canDeactivate: true,
  canReactivate: true,
  isLoading: false,
  isChangingStatus: false,
  error: "",
  setFilters: vi.fn(),
  applyFilters: vi.fn(),
  clearFilters: vi.fn(),
  viewProduct: vi.fn(),
  createProduct: vi.fn(),
  requestStatusChange: vi.fn(),
  cancelStatusChange: vi.fn(),
  confirmStatusChange: vi.fn(),
  cancel: vi.fn(),
}

describe("ProductListScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProductsMock.mockReturnValue(defaultState)
  })

  it("returns page metadata", () => {
    expect(meta()).toEqual([{ title: "Productos | Mype" }])
  })

  it("renders empty state and create action", () => {
    render(<ProductListScreen />)
    expect(screen.getByText("No se encontraron productos")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Nuevo producto" }))
    expect(defaultState.createProduct).toHaveBeenCalledOnce()
  })

  it("renders loading and error states without the empty state", () => {
    useProductsMock.mockReturnValue({
      ...defaultState,
      isLoading: true,
      error: "No fue posible cargar los productos.",
    })
    render(<ProductListScreen />)
    expect(screen.getByText("Cargando productos...")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No fue posible cargar los productos.",
    )
    expect(
      screen.queryByText("No se encontraron productos"),
    ).not.toBeInTheDocument()
  })

  it("renders active and inactive products using their status permissions", () => {
    useProductsMock.mockReturnValue({
      ...defaultState,
      products: [activeProduct, inactiveProduct],
    })
    render(<ProductListScreen />)
    expect(
      screen.getByRole("region", { name: "Listado de productos" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Desactivar" }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Reactivar" }),
    ).toBeInTheDocument()
  })

  it("hides create and status actions without permissions", () => {
    useProductsMock.mockReturnValue({
      ...defaultState,
      products: [activeProduct, inactiveProduct],
      canCreate: false,
      canDeactivate: false,
      canReactivate: false,
    })
    render(<ProductListScreen />)
    expect(
      screen.queryByRole("button", { name: "Nuevo producto" }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Desactivar" }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Reactivar" }),
    ).not.toBeInTheDocument()
  })
})

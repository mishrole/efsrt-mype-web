import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PRODUCT_STATUS_FILTERS } from "~/features/products/constants"
import { useProducts } from "~/features/products/screens/product-list/hooks/use-products"
import { CategoryType } from "~/services/categories/interfaces"
import { listCategories } from "~/services/categories/list-categories"
import { listProducts } from "~/services/products/list-products"
import { APP_PATHS } from "~/shared/constants/pages"

const navigateMock = vi.fn()
const listProductsMock = vi.mocked(listProducts)
const listCategoriesMock = vi.mocked(listCategories)

const authState = {
  accessToken: "access-token" as string | null,
}

const businessState = {
  currentBusinessId: "business-id" as string | null,
  context: {
    businessId: "business-id",
    displayName: "Negocio",
    currencyCode: "PEN",
    membershipId: "membership-id",
    roleId: "role-id",
    roleCode: "OWNER",
    permissions: ["PRODUCT_READ", "PRODUCT_CREATE"],
  },
}

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
}))

vi.mock("~/features/auth/stores/session", () => ({
  useAuthSessionStore: (selector: (state: typeof authState) => unknown) =>
    selector(authState),
}))

vi.mock("~/features/business/stores/business-context", () => ({
  useBusinessContextStore: (
    selector: (state: typeof businessState) => unknown,
  ) => selector(businessState),
}))

vi.mock("~/services/categories/list-categories", () => ({
  listCategories: vi.fn(),
}))

vi.mock("~/services/products/list-products", () => ({
  listProducts: vi.fn(),
}))

const products = [
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
]

const categories = [
  {
    id: "category-id",
    businessId: "business-id",
    name: "Bebidas",
    type: CategoryType.Sale,
    isDefault: false,
    isActive: true,
  },
]

describe("useProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authState.accessToken = "access-token"
    businessState.currentBusinessId = "business-id"
    businessState.context.permissions = ["PRODUCT_READ", "PRODUCT_CREATE"]
    listProductsMock.mockResolvedValue(products)
    listCategoriesMock.mockResolvedValue(categories)
  })

  it("loads products and sale categories for the current business", async () => {
    const { result } = renderHook(() => useProducts())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.products).toEqual(products)
    expect(result.current.categories).toEqual(categories)
    expect(result.current.currencyCode).toBe("PEN")
    expect(result.current.canCreate).toBe(true)
    expect(listProductsMock).toHaveBeenCalledWith(
      {
        businessId: "business-id",
        search: "",
        categoryId: undefined,
        isActive: undefined,
      },
      "access-token",
      expect.any(AbortSignal),
    )
    expect(listCategoriesMock).toHaveBeenCalledWith(
      {
        businessId: "business-id",
        type: CategoryType.Sale,
      },
      "access-token",
      expect.any(AbortSignal),
    )
  })

  it("applies and clears product filters", async () => {
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.setFilters({
        search: "gaseosa",
        categoryId: "category-id",
        status: PRODUCT_STATUS_FILTERS.inactive,
      })
    })

    act(() => result.current.applyFilters())

    await waitFor(() =>
      expect(listProductsMock).toHaveBeenLastCalledWith(
        {
          businessId: "business-id",
          search: "gaseosa",
          categoryId: "category-id",
          isActive: false,
        },
        "access-token",
        expect.any(AbortSignal),
      ),
    )

    act(() => result.current.clearFilters())

    expect(result.current.filters).toEqual({
      search: "",
      categoryId: "all",
      status: PRODUCT_STATUS_FILTERS.all,
    })
  })

  it("navigates to product creation and detail", async () => {
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.createProduct())
    act(() => result.current.viewProduct("product-id"))

    expect(navigateMock).toHaveBeenNthCalledWith(1, APP_PATHS.PRODUCT_CREATE)
    expect(navigateMock).toHaveBeenNthCalledWith(
      2,
      APP_PATHS.PRODUCT_DETAIL("product-id"),
    )
  })

  it("does not request products without authentication or a business", async () => {
    authState.accessToken = null
    businessState.currentBusinessId = null

    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.products).toEqual([])
    expect(listProductsMock).not.toHaveBeenCalled()
    expect(listCategoriesMock).not.toHaveBeenCalled()
  })

  it("exposes the API error and hides creation without permission", async () => {
    businessState.context.permissions = ["PRODUCT_READ"]
    listProductsMock.mockRejectedValue(new Error("network"))

    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe("No fue posible cargar los productos.")
    expect(result.current.products).toEqual([])
    expect(result.current.canCreate).toBe(false)
  })
})

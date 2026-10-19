import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PRODUCT_STATUS_FILTERS } from "~/features/products/constants"
import { useProducts } from "~/features/products/screens/product-list/hooks/use-products"
import { listProductCategories } from "~/services/product-categories"
import {
  deactivateProduct,
  reactivateProduct,
} from "~/services/products/change-product-status"
import { getProductDetail } from "~/services/products/get-product-detail"
import { listProducts } from "~/services/products/list-products"
import { APP_PATHS } from "~/shared/constants/pages"
import { createApiError } from "~/shared/http/errors"

const navigateMock = vi.fn()
const listProductsMock = vi.mocked(listProducts)
const listProductCategoriesMock = vi.mocked(listProductCategories)
const getProductDetailMock = vi.mocked(getProductDetail)
const deactivateProductMock = vi.mocked(deactivateProduct)
const reactivateProductMock = vi.mocked(reactivateProduct)

interface BusinessContextTestState {
  currentBusinessId: string | null
  context: {
    currencyCode: string
    permissions: string[]
  } | null
}

const authState = { accessToken: "access-token" as string | null }
const businessState: BusinessContextTestState = {
  currentBusinessId: "business-id",
  context: {
    currencyCode: "PEN",
    permissions: [
      "PRODUCT_READ",
      "PRODUCT_CREATE",
      "PRODUCT_DEACTIVATE",
      "PRODUCT_REACTIVATE",
    ],
  },
}

vi.mock("react-router", () => ({ useNavigate: () => navigateMock }))
vi.mock("~/features/auth/stores/session", () => ({
  useAuthSessionStore: (selector: (state: typeof authState) => unknown) =>
    selector(authState),
}))
vi.mock("~/features/business/stores/business-context", () => ({
  useBusinessContextStore: (
    selector: (state: typeof businessState) => unknown,
  ) => selector(businessState),
}))
vi.mock("~/services/product-categories", () => ({
  listProductCategories: vi.fn(),
}))
vi.mock("~/services/products/list-products", () => ({ listProducts: vi.fn() }))
vi.mock("~/services/products/get-product-detail", () => ({
  getProductDetail: vi.fn(),
}))
vi.mock("~/services/products/change-product-status", () => ({
  deactivateProduct: vi.fn(),
  reactivateProduct: vi.fn(),
}))

const activeProduct = {
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
const productCategories = [
  {
    id: "product-category-id",
    businessId: "business-id",
    name: "Bebidas",
    color: "#3F6FC4",
    isDefault: false,
    isActive: true,
    deactivatedAt: null,
    createdAt: "2026-10-18T05:00:00Z",
    updatedAt: "2026-10-18T05:00:00Z",
    version: 1,
  },
]
const productDetail = {
  ...activeProduct,
  categoryType: 1,
  createdAt: "2026-10-18T05:00:00Z",
  updatedAt: "2026-10-18T05:00:00Z",
  version: 4,
}

describe("useProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authState.accessToken = "access-token"
    businessState.currentBusinessId = "business-id"
    businessState.context = {
      currencyCode: "PEN",
      permissions: [
        "PRODUCT_READ",
        "PRODUCT_CREATE",
        "PRODUCT_DEACTIVATE",
        "PRODUCT_REACTIVATE",
      ],
    }
    listProductsMock.mockResolvedValue([activeProduct])
    listProductCategoriesMock.mockResolvedValue(productCategories)
    getProductDetailMock.mockResolvedValue(productDetail)
    deactivateProductMock.mockResolvedValue({
      ...productDetail,
      deactivatedAt: "2026-10-19T00:00:00Z",
      isActive: false,
    })
    reactivateProductMock.mockResolvedValue({
      ...productDetail,
      deactivatedAt: null,
      isActive: true,
    })
  })

  it("loads data and exposes permissions", async () => {
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.products).toEqual([activeProduct])
    expect(result.current.productCategories).toEqual(productCategories)
    expect(result.current.canCreate).toBe(true)
    expect(result.current.canDeactivate).toBe(true)
    expect(result.current.canReactivate).toBe(true)
  })

  it("applies active, inactive and all filters", async () => {
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() =>
      result.current.setFilters({
        search: "gaseosa",
        productCategoryId: "product-category-id",
        status: PRODUCT_STATUS_FILTERS.active,
      }),
    )
    act(() => result.current.applyFilters())
    await waitFor(() =>
      expect(listProductsMock).toHaveBeenLastCalledWith(
        {
          businessId: "business-id",
          search: "gaseosa",
          productCategoryId: "product-category-id",
          isActive: true,
        },
        "access-token",
        expect.any(AbortSignal),
      ),
    )

    act(() =>
      result.current.setFilters({
        search: "",
        productCategoryId: "all",
        status: PRODUCT_STATUS_FILTERS.inactive,
      }),
    )
    act(() => result.current.applyFilters())
    await waitFor(() =>
      expect(listProductsMock).toHaveBeenLastCalledWith(
        {
          businessId: "business-id",
          search: "",
          productCategoryId: undefined,
          isActive: false,
        },
        "access-token",
        expect.any(AbortSignal),
      ),
    )

    act(() => result.current.clearFilters())
    expect(result.current.filters).toEqual({
      search: "",
      productCategoryId: "all",
      status: PRODUCT_STATUS_FILTERS.all,
    })
  })

  it("navigates to create and detail", async () => {
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

  it("opens, cancels and confirms deactivation", async () => {
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    act(() => result.current.requestStatusChange(activeProduct))
    expect(result.current.pendingStatusProduct).toEqual(activeProduct)
    await act(async () => result.current.confirmStatusChange())
    expect(getProductDetailMock).toHaveBeenCalledWith(
      { businessId: "business-id", productId: "product-id" },
      "access-token",
    )
    expect(deactivateProductMock).toHaveBeenCalledWith(
      { businessId: "business-id", productId: "product-id", version: 4 },
      "access-token",
    )
    expect(result.current.pendingStatusProduct).toBeNull()
  })

  it("confirms reactivation", async () => {
    const inactiveProduct = { ...activeProduct, isActive: false }
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    act(() => result.current.requestStatusChange(inactiveProduct))
    await act(async () => result.current.confirmStatusChange())
    expect(reactivateProductMock).toHaveBeenCalledWith(
      { businessId: "business-id", productId: "product-id", version: 4 },
      "access-token",
    )
  })

  it("does not close the dialog while changing status", async () => {
    let releaseRequest: (() => void) | undefined
    getProductDetailMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseRequest = () => resolve(productDetail)
        }),
    )
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    act(() => result.current.requestStatusChange(activeProduct))
    let confirmationPromise: Promise<void>
    act(() => {
      confirmationPromise = result.current.confirmStatusChange()
    })
    await waitFor(() => expect(result.current.isChangingStatus).toBe(true))
    act(() => result.current.cancelStatusChange())
    expect(result.current.pendingStatusProduct).toEqual(activeProduct)
    releaseRequest?.()
    await act(async () => confirmationPromise!)
  })

  it("reports loading and status errors", async () => {
    listProductsMock.mockRejectedValueOnce(new Error("network"))
    const firstRender = renderHook(() => useProducts())
    await waitFor(() =>
      expect(firstRender.result.current.isLoading).toBe(false),
    )
    expect(firstRender.result.current.error).toBe(
      "No fue posible cargar los productos.",
    )

    listProductsMock.mockResolvedValue([activeProduct])
    getProductDetailMock.mockRejectedValueOnce(new Error("status"))
    const secondRender = renderHook(() => useProducts())
    await waitFor(() =>
      expect(secondRender.result.current.isLoading).toBe(false),
    )
    act(() => secondRender.result.current.requestStatusChange(activeProduct))
    await act(async () => secondRender.result.current.confirmStatusChange())
    expect(secondRender.result.current.error).toBe(
      "No fue posible cambiar el estado del producto.",
    )
  })

  it("does not request data without session context", async () => {
    authState.accessToken = null
    businessState.currentBusinessId = null
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.products).toEqual([])
    expect(listProductsMock).not.toHaveBeenCalled()
  })

  it("navigates back to the dashboard", async () => {
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.cancel())

    expect(navigateMock).toHaveBeenCalledWith(APP_PATHS.DASHBOARD)
  })

  it("uses API messages for loading and status errors", async () => {
    listProductsMock.mockRejectedValueOnce(
      createApiError(400, { message: "Error al listar" }),
    )
    const firstRender = renderHook(() => useProducts())
    await waitFor(() =>
      expect(firstRender.result.current.isLoading).toBe(false),
    )
    expect(firstRender.result.current.error).toBe("Error al listar")
    firstRender.unmount()

    listProductsMock.mockResolvedValue([activeProduct])
    getProductDetailMock.mockRejectedValueOnce(
      createApiError(409, { message: "Versión desactualizada" }),
    )
    const secondRender = renderHook(() => useProducts())
    await waitFor(() =>
      expect(secondRender.result.current.isLoading).toBe(false),
    )
    act(() => secondRender.result.current.requestStatusChange(activeProduct))
    await act(async () => secondRender.result.current.confirmStatusChange())
    expect(secondRender.result.current.error).toBe("Versión desactualizada")
  })

  it("exposes fallback currency and denied permissions without context", async () => {
    businessState.context = null

    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.currencyCode).toBe("PEN")
    expect(result.current.canCreate).toBe(false)
    expect(result.current.canDeactivate).toBe(false)
    expect(result.current.canReactivate).toBe(false)
  })

  it("cancels a pending status change when idle", async () => {
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    act(() => result.current.requestStatusChange(activeProduct))

    act(() => result.current.cancelStatusChange())

    expect(result.current.pendingStatusProduct).toBeNull()
  })

  it("returns early when status confirmation has no pending product", async () => {
    const { result } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => result.current.confirmStatusChange())

    expect(getProductDetailMock).not.toHaveBeenCalled()
  })

  it("returns early when authentication disappears before confirmation", async () => {
    const { result, rerender } = renderHook(() => useProducts())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.requestStatusChange(activeProduct)
    })

    act(() => {
      authState.accessToken = null
      rerender()
    })

    await act(async () => {
      await result.current.confirmStatusChange()
    })

    expect(getProductDetailMock).not.toHaveBeenCalled()
  })

  it("ignores successful loading results after the request is aborted", async () => {
    let resolveProducts: ((value: (typeof activeProduct)[]) => void) | undefined
    listProductsMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveProducts = resolve
        }),
    )
    const { unmount } = renderHook(() => useProducts())

    unmount()
    resolveProducts?.([activeProduct])
    await Promise.resolve()

    expect(deactivateProductMock).not.toHaveBeenCalled()
  })
})

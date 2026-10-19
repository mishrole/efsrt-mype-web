import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useProductDetail } from "~/features/products/screens/product-detail/hooks/use-product-detail"
import { listProductCategories } from "~/services/product-categories"
import { getProductDetail } from "~/services/products/get-product-detail"
import { updateProduct } from "~/services/products/update-product"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"

const navigateMock = vi.fn()
const routeState = { productId: "product-id" }
const authState = { accessToken: "access-token" as string | null }
const businessState = {
  currentBusinessId: "business-id" as string | null,
  context: {
    permissions: ["PRODUCT_UPDATE"],
  } as { permissions: string[] } | null,
}

const getProductDetailMock = vi.mocked(getProductDetail)
const listProductCategoriesMock = vi.mocked(listProductCategories)
const updateProductMock = vi.mocked(updateProduct)
const isApiErrorMock = vi.mocked(isApiError)

vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => routeState,
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

vi.mock("~/services/product-categories", () => ({
  listProductCategories: vi.fn(),
}))

vi.mock("~/services/products/get-product-detail", () => ({
  getProductDetail: vi.fn(),
}))

vi.mock("~/services/products/update-product", () => ({
  updateProduct: vi.fn(),
}))

vi.mock("~/shared/http/errors", () => ({
  isApiError: vi.fn(),
}))

const productDetail = {
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
  createdAt: "2026-10-18T05:00:00Z",
  updatedAt: "2026-10-18T05:00:00Z",
  version: 4,
}

const activeProductCategory = {
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
}

const anotherProductCategory = {
  ...activeProductCategory,
  id: "another-product-category-id",
  name: "Postres",
}

const formValues = {
  name: "Gaseosa actualizada",
  productCategoryId: "another-product-category-id",
  salePrice: 4.5,
  unitCost: 3.25,
}

describe("useProductDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routeState.productId = "product-id"
    authState.accessToken = "access-token"
    businessState.currentBusinessId = "business-id"
    businessState.context = {
      permissions: ["PRODUCT_UPDATE"],
    }
    isApiErrorMock.mockReturnValue(false)
    getProductDetailMock.mockResolvedValue(productDetail)
    listProductCategoriesMock.mockResolvedValue([
      activeProductCategory,
      anotherProductCategory,
    ])
    updateProductMock.mockResolvedValue({
      ...productDetail,
      ...formValues,
      deactivatedAt: null,
      version: 5,
    })
  })

  it("loads product detail and active categories", async () => {
    const { result } = renderHook(() => useProductDetail())

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await waitFor(() =>
      expect(result.current.productCategories).toHaveLength(2),
    )

    expect(getProductDetailMock).toHaveBeenCalledWith(
      {
        businessId: "business-id",
        productId: "product-id",
      },
      "access-token",
      expect.any(AbortSignal),
    )
    expect(listProductCategoriesMock).toHaveBeenCalledWith(
      {
        businessId: "business-id",
        isActive: true,
      },
      "access-token",
      expect.any(AbortSignal),
    )
    expect(result.current.product).toEqual(productDetail)
    expect(result.current.canUpdate).toBe(true)
    expect(result.current.error).toBe("")
    expect(result.current.categoriesError).toBe("")
  })

  it("keeps the current category when it is absent from active categories", async () => {
    listProductCategoriesMock.mockResolvedValue([anotherProductCategory])
    const { result } = renderHook(() => useProductDetail())

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await waitFor(() =>
      expect(result.current.productCategories).toHaveLength(2),
    )

    expect(result.current.productCategories[0]).toEqual({
      id: "product-category-id",
      businessId: "business-id",
      name: "Bebidas",
      color: "#3F6FC4",
      isDefault: false,
      isActive: true,
      deactivatedAt: null,
      createdAt: "2026-10-18T05:00:00Z",
      updatedAt: "2026-10-18T05:00:00Z",
      version: 4,
    })
  })

  it("does not load categories without update permission", async () => {
    businessState.context = {
      permissions: [],
    }
    const { result } = renderHook(() => useProductDetail())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.canUpdate).toBe(false)
    expect(result.current.productCategories).toEqual([
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
        version: 4,
      },
    ])
    expect(listProductCategoriesMock).not.toHaveBeenCalled()
  })

  it("reports product and category fallback errors", async () => {
    getProductDetailMock.mockRejectedValueOnce(new Error("network"))
    const firstRender = renderHook(() => useProductDetail())

    await waitFor(() =>
      expect(firstRender.result.current.error).toBe(
        "No fue posible cargar el producto.",
      ),
    )
    expect(firstRender.result.current.isLoading).toBe(true)
    firstRender.unmount()

    getProductDetailMock.mockResolvedValue(productDetail)
    listProductCategoriesMock.mockRejectedValueOnce(new Error("network"))
    const secondRender = renderHook(() => useProductDetail())

    await waitFor(() =>
      expect(secondRender.result.current.isLoading).toBe(false),
    )
    await waitFor(() =>
      expect(secondRender.result.current.categoriesError).toBe(
        "El producto se cargó, pero no fue posible consultar las categorías disponibles.",
      ),
    )
  })

  it("uses API error messages", async () => {
    const apiException = {
      message: "Producto no encontrado",
    }
    isApiErrorMock.mockImplementation((exception) => exception === apiException)
    getProductDetailMock.mockRejectedValueOnce(apiException)
    const { result } = renderHook(() => useProductDetail())

    await waitFor(() =>
      expect(result.current.error).toBe("Producto no encontrado"),
    )
    expect(result.current.isLoading).toBe(true)
  })

  it("updates the product and reloads its detail", async () => {
    getProductDetailMock
      .mockResolvedValueOnce(productDetail)
      .mockResolvedValueOnce({
        ...productDetail,
        ...formValues,
        version: 5,
      })
    const { result } = renderHook(() => useProductDetail())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await waitFor(() =>
      expect(result.current.productCategories).toHaveLength(2),
    )

    await act(async () => result.current.submitProduct(formValues))

    expect(updateProductMock).toHaveBeenCalledWith(
      "business-id",
      "product-id",
      {
        ...formValues,
        categoryId: "financial-category-id",
        version: 4,
      },
      "access-token",
    )
    expect(getProductDetailMock).toHaveBeenCalledTimes(2)
    expect(result.current.product?.version).toBe(5)
    expect(result.current.isSubmitting).toBe(false)
  })

  it("reports update errors and blocks duplicate submissions", async () => {
    let rejectUpdate: ((reason: unknown) => void) | undefined
    updateProductMock.mockImplementation(
      () =>
        new Promise((resolve, reject) => {
          rejectUpdate = reject
        }),
    )
    const { result } = renderHook(() => useProductDetail())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await waitFor(() =>
      expect(result.current.productCategories).toHaveLength(2),
    )

    let firstSubmission: Promise<void>
    act(() => {
      firstSubmission = result.current.submitProduct(formValues)
    })
    await waitFor(() => expect(result.current.isSubmitting).toBe(true))
    await act(async () => result.current.submitProduct(formValues))
    expect(updateProductMock).toHaveBeenCalledOnce()

    rejectUpdate?.(new Error("network"))
    await act(async () => firstSubmission!)

    expect(result.current.error).toBe("No fue posible actualizar el producto.")
    expect(result.current.isSubmitting).toBe(false)
  })

  it("does not submit before categories finish loading", async () => {
    let resolveCategories:
      ((categories: (typeof activeProductCategory)[]) => void) | undefined
    listProductCategoriesMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCategories = resolve
        }),
    )
    const { result } = renderHook(() => useProductDetail())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => result.current.submitProduct(formValues))

    expect(updateProductMock).not.toHaveBeenCalled()
    resolveCategories?.([activeProductCategory])
  })

  it("reloads the product and returns to products", async () => {
    const { result } = renderHook(() => useProductDetail())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    await act(async () => result.current.reloadProduct())
    act(() => result.current.returnToProducts())

    expect(getProductDetailMock).toHaveBeenCalledTimes(2)
    expect(navigateMock).toHaveBeenCalledWith(APP_PATHS.PRODUCTS)
  })

  it("stops without route or session context", async () => {
    routeState.productId = ""
    authState.accessToken = null
    businessState.currentBusinessId = null
    const { result } = renderHook(() => useProductDetail())

    await act(async () => result.current.reloadProduct())
    await act(async () => result.current.submitProduct(formValues))

    expect(result.current.product).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(getProductDetailMock).not.toHaveBeenCalled()
    expect(updateProductMock).not.toHaveBeenCalled()
  })

  it("ignores resolved product data after unmount aborts the request", async () => {
    let resolveProduct: ((product: typeof productDetail) => void) | undefined
    getProductDetailMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveProduct = resolve
        }),
    )
    const { unmount } = renderHook(() => useProductDetail())

    unmount()
    resolveProduct?.(productDetail)
    await Promise.resolve()

    expect(listProductCategoriesMock).not.toHaveBeenCalled()
  })
})

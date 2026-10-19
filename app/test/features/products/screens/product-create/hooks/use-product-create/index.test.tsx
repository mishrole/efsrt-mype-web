import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useProductCreate } from "~/features/products/screens/product-create/hooks/use-product-create"
import { CategoryType } from "~/services/categories/interfaces"
import { listCategories } from "~/services/categories/list-categories"
import { listProductCategories } from "~/services/product-categories"
import { createProduct } from "~/services/products/create-product"
import { APP_PATHS } from "~/shared/constants/pages"
import { createApiError } from "~/shared/http/errors"

const navigateMock = vi.fn()
const listCategoriesMock = vi.mocked(listCategories)
const listProductCategoriesMock = vi.mocked(listProductCategories)
const createProductMock = vi.mocked(createProduct)
const authState = { accessToken: "access-token" as string | null }
const businessState = { currentBusinessId: "business-id" as string | null }

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
vi.mock("~/services/categories/list-categories", () => ({
  listCategories: vi.fn(),
}))
vi.mock("~/services/product-categories", () => ({
  listProductCategories: vi.fn(),
}))
vi.mock("~/services/products/create-product", () => ({
  createProduct: vi.fn(),
}))

const financialCategory = {
  id: "financial-category-id",
  businessId: "business-id",
  name: "Productos",
  type: CategoryType.Sale,
  isDefault: true,
  isActive: true,
}
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
const formValues = {
  name: "Gaseosa",
  productCategoryId: "product-category-id",
  salePrice: 3.5,
  unitCost: 2.25,
}

describe("useProductCreate", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    authState.accessToken = "access-token"
    businessState.currentBusinessId = "business-id"
    listCategoriesMock.mockResolvedValue([financialCategory])
    listProductCategoriesMock.mockResolvedValue([productCategory])
    createProductMock.mockResolvedValue({
      id: "product-id",
      businessId: "business-id",
      categoryId: "financial-category-id",
      categoryName: "Productos",
      name: "Gaseosa",
      salePrice: 3.5,
      unitCost: 2.25,
      isActive: true,
      createdAt: "",
      updatedAt: "",
    })
  })

  it("loads dependencies and creates the product", async () => {
    const { result } = renderHook(() => useProductCreate())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(listCategoriesMock).toHaveBeenCalledWith(
      { businessId: "business-id", type: CategoryType.Sale, isActive: true },
      "access-token",
      expect.any(AbortSignal),
    )
    expect(result.current.canSubmit).toBe(true)
    await act(async () => result.current.submitProduct(formValues))
    expect(createProductMock).toHaveBeenCalledWith(
      "business-id",
      { ...formValues, categoryId: "financial-category-id" },
      "access-token",
    )
    expect(navigateMock).toHaveBeenCalledWith(APP_PATHS.PRODUCTS)
  })

  it("reports missing Productos financial category", async () => {
    listCategoriesMock.mockResolvedValue([
      { ...financialCategory, name: "Ventas" },
    ])
    const { result } = renderHook(() => useProductCreate())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.canSubmit).toBe(false)
    expect(result.current.error).toContain('SALE llamada "Productos"')
    await act(async () => result.current.submitProduct(formValues))
    expect(createProductMock).not.toHaveBeenCalled()
  })

  it("reports API dependency and creation errors", async () => {
    listCategoriesMock.mockRejectedValueOnce(
      createApiError(400, { message: "Error de categorías" }),
    )
    const firstRender = renderHook(() => useProductCreate())
    await waitFor(() =>
      expect(firstRender.result.current.isLoading).toBe(false),
    )
    expect(firstRender.result.current.error).toBe("Error de categorías")
    firstRender.unmount()

    listCategoriesMock.mockResolvedValue([financialCategory])
    createProductMock.mockRejectedValueOnce(
      createApiError(400, { message: "Producto inválido" }),
    )
    const secondRender = renderHook(() => useProductCreate())
    await waitFor(() =>
      expect(secondRender.result.current.canSubmit).toBe(true),
    )
    await act(async () => secondRender.result.current.submitProduct(formValues))
    expect(secondRender.result.current.error).toBe("Producto inválido")
    expect(secondRender.result.current.isSubmitting).toBe(false)
  })

  it("stops without session context and returns to products", async () => {
    authState.accessToken = null
    businessState.currentBusinessId = null
    const { result } = renderHook(() => useProductCreate())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(listCategoriesMock).not.toHaveBeenCalled()
    act(() => result.current.returnToProducts())
    expect(navigateMock).toHaveBeenCalledWith(APP_PATHS.PRODUCTS)
  })

  it("uses the dependency fallback message for a non-API error", async () => {
    listCategoriesMock.mockRejectedValueOnce(new Error("network"))

    const { result } = renderHook(() => useProductCreate())

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBe(
      "No fue posible cargar las categorías necesarias.",
    )
  })

  it("uses the creation fallback message for a non-API error", async () => {
    createProductMock.mockRejectedValueOnce(new Error("network"))
    const { result } = renderHook(() => useProductCreate())
    await waitFor(() => expect(result.current.canSubmit).toBe(true))

    await act(async () => result.current.submitProduct(formValues))

    expect(result.current.error).toBe("No fue posible crear el producto.")
  })

  it("ignores resolved dependencies after unmount aborts the request", async () => {
    let resolveFinancialCategories:
      ((value: (typeof financialCategory)[]) => void) | undefined
    listCategoriesMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFinancialCategories = resolve
        }),
    )
    const { unmount } = renderHook(() => useProductCreate())

    unmount()
    resolveFinancialCategories?.([financialCategory])
    await Promise.resolve()

    expect(createProductMock).not.toHaveBeenCalled()
  })

  it("does not submit while an existing submission is running", async () => {
    let releaseCreation: (() => void) | undefined
    createProductMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          releaseCreation = () =>
            resolve({
              id: "product-id",
              businessId: "business-id",
              categoryId: "financial-category-id",
              categoryName: "Productos",
              name: "Gaseosa",
              salePrice: 3.5,
              unitCost: 2.25,
              isActive: true,
              createdAt: "",
              updatedAt: "",
            })
        }),
    )
    const { result } = renderHook(() => useProductCreate())
    await waitFor(() => expect(result.current.canSubmit).toBe(true))

    let firstSubmission: Promise<void>
    act(() => {
      firstSubmission = result.current.submitProduct(formValues)
    })
    await waitFor(() => expect(result.current.isSubmitting).toBe(true))
    await act(async () => result.current.submitProduct(formValues))

    expect(createProductMock).toHaveBeenCalledOnce()
    releaseCreation?.()
    await act(async () => firstSubmission!)
  })
})

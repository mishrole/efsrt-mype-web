import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useProductCategories } from "~/features/product-categories/screens/product-category-list/hooks/use-product-categories"
import { listProductCategories } from "~/services/product-categories"
import { APP_PATHS } from "~/shared/constants/pages"
const navigateMock = vi.fn()
const listMock = vi.mocked(listProductCategories)
const auth = { accessToken: "token" as string | null }
const business = {
  currentBusinessId: "business-id" as string | null,
  context: { permissions: ["PRODUCT_CATEGORY_CREATE"] } as {
    permissions: string[]
  } | null,
}
vi.mock("react-router", () => ({ useNavigate: () => navigateMock }))
vi.mock("~/features/auth/stores/session", () => ({
  useAuthSessionStore: (selector: (state: typeof auth) => unknown) =>
    selector(auth),
}))
vi.mock("~/features/business/stores/business-context", () => ({
  useBusinessContextStore: (selector: (state: typeof business) => unknown) =>
    selector(business),
}))
vi.mock("~/services/product-categories", () => ({
  listProductCategories: vi.fn(),
}))
const category = {
  id: "category-id",
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
describe("useProductCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    auth.accessToken = "token"
    business.currentBusinessId = "business-id"
    business.context = { permissions: ["PRODUCT_CATEGORY_CREATE"] }
    listMock.mockResolvedValue([category])
  })
  it("loads, filters, clears and navigates", async () => {
    const { result } = renderHook(() => useProductCategories())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.productCategories).toEqual([category])
    expect(result.current.canCreate).toBe(true)
    act(() => result.current.setFilters({ search: "beb", status: "inactive" }))
    act(() => result.current.applyFilters())
    await waitFor(() =>
      expect(listMock).toHaveBeenLastCalledWith(
        { businessId: "business-id", search: "beb", isActive: false },
        "token",
        expect.any(AbortSignal),
      ),
    )
    act(() => result.current.clearFilters())
    act(() => result.current.createProductCategory())
    act(() => result.current.editProductCategory("category-id"))
    expect(navigateMock).toHaveBeenNthCalledWith(
      1,
      APP_PATHS.PRODUCT_CATEGORY_CREATE,
    )
    expect(navigateMock).toHaveBeenNthCalledWith(
      2,
      APP_PATHS.PRODUCT_CATEGORY_DETAIL("category-id"),
    )
  })
  it("handles errors and missing context", async () => {
    listMock.mockRejectedValueOnce(new Error("network"))
    const first = renderHook(() => useProductCategories())
    await waitFor(() => expect(first.result.current.isLoading).toBe(false))
    expect(first.result.current.error).toBeTruthy()
    first.unmount()
    auth.accessToken = null
    business.currentBusinessId = null
    business.context = null
    const second = renderHook(() => useProductCategories())
    await waitFor(() => expect(second.result.current.isLoading).toBe(false))
    expect(second.result.current.productCategories).toEqual([])
    expect(second.result.current.canCreate).toBe(false)
  })
})

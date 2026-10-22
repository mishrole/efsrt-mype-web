import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useMovementHistory } from "~/features/financial-movements/screens/movement-history-list/hooks/use-movement-history"
import { CategoryType } from "~/services/categories/interfaces"
import { listCategories } from "~/services/categories/list-categories"
import { listFinancialMovementHistory } from "~/services/financial-movements/list-financial-movement-history"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"
import { APP_PATHS } from "~/shared/constants/pages"
import { createApiError } from "~/shared/http/errors"

const navigateMock = vi.fn()
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
vi.mock(
  "~/services/financial-movements/list-financial-movement-history",
  () => ({
    listFinancialMovementHistory: vi.fn(),
  }),
)

const listCategoriesMock = vi.mocked(listCategories)
const listHistoryMock = vi.mocked(listFinancialMovementHistory)
const emptyPage = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
}
const categories = [
  {
    id: "category-id",
    businessId: "business-id",
    name: "Ventas",
    type: CategoryType.Sale,
    isDefault: false,
    isActive: false,
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  authState.accessToken = "access-token"
  businessState.currentBusinessId = "business-id"
  listHistoryMock.mockResolvedValue(emptyPage)
  listCategoriesMock.mockResolvedValue(categories)
})

describe("useMovementHistory", () => {
  it("loads the first page and all categories without date defaults", async () => {
    const { result } = renderHook(() => useMovementHistory())

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(listHistoryMock).toHaveBeenCalledWith(
      {
        businessId: "business-id",
        type: undefined,
        status: undefined,
        dateFrom: undefined,
        dateTo: undefined,
        categoryId: undefined,
        page: 1,
        pageSize: 20,
      },
      "access-token",
      expect.any(AbortSignal),
    )
    expect(listCategoriesMock).toHaveBeenCalledWith(
      { businessId: "business-id" },
      "access-token",
      expect.any(AbortSignal),
    )
    expect(result.current.categories).toEqual(categories)
  })

  it("applies combined filters and returns to the first page", async () => {
    const { result } = renderHook(() => useMovementHistory())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.setFilters({
        type: 1,
        status: FinancialMovementStatus.Confirmed,
        dateFrom: "2026-10-01",
        dateTo: "2026-10-31",
        categoryId: "category-id",
      })
    })
    act(() => result.current.applyFilters())
    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(listHistoryMock).toHaveBeenCalledTimes(2))
    expect(listHistoryMock).toHaveBeenLastCalledWith(
      {
        businessId: "business-id",
        type: 1,
        status: FinancialMovementStatus.Confirmed,
        dateFrom: "2026-10-01",
        dateTo: "2026-10-31",
        categoryId: "category-id",
        page: 1,
        pageSize: 20,
      },
      "access-token",
      expect.any(AbortSignal),
    )
  })

  it("clears filters and reloads the first unfiltered page", async () => {
    const { result } = renderHook(() => useMovementHistory())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.setFilters({
        type: 2,
        status: FinancialMovementStatus.Cancelled,
        dateFrom: "2026-10-01",
        dateTo: "2026-10-31",
        categoryId: "category-id",
      })
    })
    act(() => result.current.applyFilters())
    await waitFor(() => expect(listHistoryMock).toHaveBeenCalledTimes(2))
    act(() => result.current.clearFilters())
    await waitFor(() => expect(listHistoryMock).toHaveBeenCalledTimes(3))

    expect(result.current.filters).toEqual({
      type: undefined,
      status: undefined,
      dateFrom: "",
      dateTo: "",
      categoryId: "",
    })
  })

  it("moves only through pages allowed by the response", async () => {
    listHistoryMock
      .mockResolvedValueOnce({
        ...emptyPage,
        totalCount: 40,
        hasNextPage: true,
      })
      .mockResolvedValueOnce({
        ...emptyPage,
        page: 2,
        totalCount: 40,
        hasPreviousPage: true,
      })
      .mockResolvedValueOnce({
        ...emptyPage,
        totalCount: 40,
        hasNextPage: true,
      })

    const { result } = renderHook(() => useMovementHistory())
    await waitFor(() => expect(result.current.hasNextPage).toBe(true))
    act(() => result.current.goToNextPage())
    expect(result.current.isLoading).toBe(true)
    await waitFor(() => expect(result.current.page).toBe(2))
    act(() => result.current.goToNextPage())
    expect(listHistoryMock).toHaveBeenCalledTimes(2)
    act(() => result.current.goToPreviousPage())
    await waitFor(() => expect(listHistoryMock).toHaveBeenCalledTimes(3))
    expect(listHistoryMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 1 }),
      "access-token",
      expect.any(AbortSignal),
    )
  })

  it("exposes API and fallback errors", async () => {
    listHistoryMock.mockRejectedValueOnce(
      createApiError(400, { message: "Rango inválido" }),
    )
    const firstRender = renderHook(() => useMovementHistory())
    await waitFor(() =>
      expect(firstRender.result.current.isLoading).toBe(false),
    )
    expect(firstRender.result.current.error).toBe("Rango inválido")
    firstRender.unmount()

    listHistoryMock.mockRejectedValueOnce(new Error("network"))
    const secondRender = renderHook(() => useMovementHistory())
    await waitFor(() =>
      expect(secondRender.result.current.isLoading).toBe(false),
    )
    expect(secondRender.result.current.error).toBe(
      "No fue posible cargar el historial financiero.",
    )
  })

  it("keeps history available when categories cannot be loaded", async () => {
    listCategoriesMock.mockRejectedValueOnce(
      new Error("categories unavailable"),
    )

    const { result } = renderHook(() => useMovementHistory())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.error).toBe("")
    expect(result.current.categories).toEqual([])
    expect(result.current.movements).toEqual([])
  })

  it("returns an empty state when authentication context is unavailable", async () => {
    authState.accessToken = null
    businessState.currentBusinessId = null

    const { result } = renderHook(() => useMovementHistory())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.movements).toEqual([])
    expect(result.current.categories).toEqual([])
    expect(listHistoryMock).not.toHaveBeenCalled()
  })

  it("uses explicit application routes", async () => {
    const { result } = renderHook(() => useMovementHistory())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => result.current.viewMovement("movement-id"))
    act(() => result.current.viewDrafts())
    act(() => result.current.returnToDashboard())

    expect(navigateMock).toHaveBeenNthCalledWith(
      1,
      APP_PATHS.FINANCIAL_MOVEMENT_DETAIL("movement-id"),
    )
    expect(navigateMock).toHaveBeenNthCalledWith(
      2,
      APP_PATHS.FINANCIAL_MOVEMENT_DRAFTS,
    )
    expect(navigateMock).toHaveBeenNthCalledWith(3, APP_PATHS.DASHBOARD)
  })
})

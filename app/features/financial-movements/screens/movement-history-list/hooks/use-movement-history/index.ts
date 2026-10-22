import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { listCategories } from "~/services/categories/list-categories"
import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import { listFinancialMovementHistory } from "~/services/financial-movements/list-financial-movement-history"
import type { FinancialMovementHistoryPageResponse } from "~/services/financial-movements/list-financial-movement-history/interfaces"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import {
  EMPTY_MOVEMENT_HISTORY_FILTERS,
  MOVEMENT_HISTORY_PAGE_SIZE,
} from "./constants"
import {
  EMPTY_MOVEMENT_HISTORY_PAGE,
  type MovementHistoryFilters,
  type UseMovementHistoryResult,
} from "./interfaces"

function getErrorMessage(exception: unknown): string {
  if (isApiError(exception)) {
    return exception.message
  }

  return "No fue posible cargar el historial financiero."
}

export function useMovementHistory(): UseMovementHistoryResult {
  const navigate = useNavigate()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const hasRequestContext = Boolean(accessToken && businessId)
  const [historyPage, setHistoryPage] =
    useState<FinancialMovementHistoryPageResponse>(EMPTY_MOVEMENT_HISTORY_PAGE)
  const [categories, setCategories] = useState<CategoryListItemResponse[]>([])
  const [filters, setFilters] = useState<MovementHistoryFilters>(
    EMPTY_MOVEMENT_HISTORY_FILTERS,
  )
  const [appliedFilters, setAppliedFilters] = useState<MovementHistoryFilters>(
    EMPTY_MOVEMENT_HISTORY_FILTERS,
  )
  const [requestedPage, setRequestedPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!accessToken || !businessId) {
      return
    }

    const historyRequestController = new AbortController()

    listFinancialMovementHistory(
      {
        businessId,
        type: appliedFilters.type,
        status: appliedFilters.status,
        dateFrom: appliedFilters.dateFrom || undefined,
        dateTo: appliedFilters.dateTo || undefined,
        categoryId: appliedFilters.categoryId || undefined,
        page: requestedPage,
        pageSize: MOVEMENT_HISTORY_PAGE_SIZE,
      },
      accessToken,
      historyRequestController.signal,
    )
      .then((historyResponse) => {
        if (!historyRequestController.signal.aborted) {
          setHistoryPage(historyResponse)
        }
      })
      .catch((exception: unknown) => {
        if (!historyRequestController.signal.aborted) {
          setError(getErrorMessage(exception))
        }
      })
      .finally(() => {
        if (!historyRequestController.signal.aborted) {
          setIsLoading(false)
        }
      })

    return () => historyRequestController.abort()
  }, [accessToken, appliedFilters, businessId, requestedPage])

  useEffect(() => {
    if (!accessToken || !businessId) {
      return
    }

    const categoryRequestController = new AbortController()

    listCategories(
      { businessId },
      accessToken,
      categoryRequestController.signal,
    )
      .then((categoryResponse) => {
        if (!categoryRequestController.signal.aborted) {
          setCategories(categoryResponse)
        }
      })
      .catch(() => {
        if (!categoryRequestController.signal.aborted) {
          setCategories([])
        }
      })

    return () => categoryRequestController.abort()
  }, [accessToken, businessId])

  function prepareHistoryRequest(): void {
    setIsLoading(true)
    setError("")
  }

  function applyFilters(): void {
    prepareHistoryRequest()
    setRequestedPage(1)
    setAppliedFilters(filters)
  }

  function clearFilters(): void {
    prepareHistoryRequest()
    setFilters(EMPTY_MOVEMENT_HISTORY_FILTERS)
    setAppliedFilters(EMPTY_MOVEMENT_HISTORY_FILTERS)
    setRequestedPage(1)
  }

  function goToPreviousPage(): void {
    if (!historyPage.hasPreviousPage) {
      return
    }

    prepareHistoryRequest()
    setRequestedPage((currentPage) => currentPage - 1)
  }

  function goToNextPage(): void {
    if (!historyPage.hasNextPage) {
      return
    }

    prepareHistoryRequest()
    setRequestedPage((currentPage) => currentPage + 1)
  }

  function viewMovement(movementId: string): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENT_DETAIL(movementId))
  }

  function viewDrafts(): void {
    void navigate(APP_PATHS.FINANCIAL_MOVEMENT_DRAFTS)
  }

  function returnToDashboard(): void {
    void navigate(APP_PATHS.DASHBOARD)
  }

  const visibleHistoryPage = hasRequestContext
    ? historyPage
    : EMPTY_MOVEMENT_HISTORY_PAGE

  return {
    movements: visibleHistoryPage.items,
    categories: hasRequestContext ? categories : [],
    filters,
    page: visibleHistoryPage.page,
    pageSize: visibleHistoryPage.pageSize,
    totalCount: visibleHistoryPage.totalCount,
    hasPreviousPage: visibleHistoryPage.hasPreviousPage,
    hasNextPage: visibleHistoryPage.hasNextPage,
    isLoading: hasRequestContext ? isLoading : false,
    error: hasRequestContext ? error : "",
    setFilters,
    applyFilters,
    clearFilters,
    goToPreviousPage,
    goToNextPage,
    viewMovement,
    viewDrafts,
    returnToDashboard,
  }
}

import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import {
  PRODUCT_CATEGORY_PERMISSIONS,
  PRODUCT_CATEGORY_STATUS_FILTERS,
} from "~/features/product-categories/constants"
import {
  deactivateProductCategory,
  listProductCategories,
  reactivateProductCategory,
} from "~/services/product-categories"
import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type { ProductCategoryFilterValues } from "../../components/product-category-filters/interfaces"
import type { UseProductCategoriesResult } from "./interfaces"

const INITIAL_FILTERS: ProductCategoryFilterValues = {
  search: "",
  status: PRODUCT_CATEGORY_STATUS_FILTERS.all,
}

function getActiveState(
  status: ProductCategoryFilterValues["status"],
): boolean | undefined {
  if (status === PRODUCT_CATEGORY_STATUS_FILTERS.active) {
    return true
  }
  if (status === PRODUCT_CATEGORY_STATUS_FILTERS.inactive) {
    return false
  }
  return undefined
}

function getErrorMessage(exception: unknown, fallbackMessage: string): string {
  if (isApiError(exception)) {
    return exception.message
  }
  return fallbackMessage
}

export function useProductCategories(): UseProductCategoriesResult {
  const navigate = useNavigate()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const context = useBusinessContextStore((state) => state.context)
  const [productCategories, setProductCategories] = useState<
    ProductCategoryResponse[]
  >([])
  const [filters, setFilters] =
    useState<ProductCategoryFilterValues>(INITIAL_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<ProductCategoryFilterValues>(INITIAL_FILTERS)
  const [pendingStatusCategory, setPendingStatusCategory] =
    useState<ProductCategoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [error, setError] = useState("")

  function cancel(): void {
    void navigate(APP_PATHS.DASHBOARD)
  }

  const loadProductCategories = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      if (!accessToken || !businessId) {
        setProductCategories([])
        setIsLoading(false)
        return
      }
      setProductCategories([])
      setIsLoading(true)
      setError("")
      try {
        const response = await listProductCategories(
          {
            businessId,
            search: appliedFilters.search,
            isActive: getActiveState(appliedFilters.status),
          },
          accessToken,
          signal,
        )
        setProductCategories(response)
      } catch (exception) {
        if (signal?.aborted) {
          return
        }
        setError(
          getErrorMessage(
            exception,
            "No fue posible cargar las categorías de producto.",
          ),
        )
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false)
        }
      }
    },
    [accessToken, appliedFilters, businessId],
  )

  useEffect(() => {
    const controller = new AbortController()
    async function synchronizeProductCategories(): Promise<void> {
      await loadProductCategories(controller.signal)
    }
    void synchronizeProductCategories()
    return () => controller.abort()
  }, [loadProductCategories])

  function applyFilters(): void {
    setAppliedFilters(filters)
  }
  function clearFilters(): void {
    setFilters(INITIAL_FILTERS)
    setAppliedFilters(INITIAL_FILTERS)
  }
  function createProductCategory(): void {
    void navigate(APP_PATHS.PRODUCT_CATEGORY_CREATE)
  }
  function editProductCategory(productCategoryId: string): void {
    void navigate(APP_PATHS.PRODUCT_CATEGORY_DETAIL(productCategoryId))
  }
  function requestStatusChange(category: ProductCategoryResponse): void {
    setPendingStatusCategory(category)
  }
  function cancelStatusChange(): void {
    if (!isChangingStatus) {
      setPendingStatusCategory(null)
    }
  }

  async function confirmStatusChange(): Promise<void> {
    if (
      !pendingStatusCategory ||
      !accessToken ||
      !businessId ||
      isChangingStatus
    ) {
      return
    }
    setIsChangingStatus(true)
    setError("")
    try {
      const updatedCategory = pendingStatusCategory.isActive
        ? await deactivateProductCategory(
            businessId,
            pendingStatusCategory.id,
            pendingStatusCategory.version,
            accessToken,
          )
        : await reactivateProductCategory(
            businessId,
            pendingStatusCategory.id,
            pendingStatusCategory.version,
            accessToken,
          )
      setProductCategories((currentCategories) =>
        currentCategories
          .map((category) =>
            category.id === updatedCategory.id ? updatedCategory : category,
          )
          .filter(
            (category) =>
              getActiveState(appliedFilters.status) === undefined ||
              category.isActive === getActiveState(appliedFilters.status),
          ),
      )
      setPendingStatusCategory(null)
    } catch (exception) {
      setError(
        getErrorMessage(
          exception,
          "No fue posible cambiar el estado de la categoría de producto.",
        ),
      )
    } finally {
      setIsChangingStatus(false)
    }
  }

  return {
    productCategories,
    filters,
    pendingStatusCategory,
    isLoading,
    isChangingStatus,
    error,
    canCreate:
      context?.permissions.includes(PRODUCT_CATEGORY_PERMISSIONS.create) ??
      false,
    canUpdate:
      context?.permissions.includes(PRODUCT_CATEGORY_PERMISSIONS.update) ??
      false,
    canDeactivate:
      context?.permissions.includes(PRODUCT_CATEGORY_PERMISSIONS.deactivate) ??
      false,
    canReactivate:
      context?.permissions.includes(PRODUCT_CATEGORY_PERMISSIONS.reactivate) ??
      false,
    setFilters,
    applyFilters,
    clearFilters,
    createProductCategory,
    editProductCategory,
    requestStatusChange,
    cancelStatusChange,
    confirmStatusChange,
    cancel,
  }
}

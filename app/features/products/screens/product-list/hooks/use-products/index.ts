import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import {
  PRODUCT_PERMISSIONS,
  PRODUCT_STATUS_FILTERS,
} from "~/features/products/constants"
import { CategoryType } from "~/services/categories/interfaces"
import { listCategories } from "~/services/categories/list-categories"
import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import { listProducts } from "~/services/products/list-products"
import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type { ProductFilterValues } from "../../components/product-filters/interfaces"
import type { UseProductsResult } from "./interfaces"

const INITIAL_FILTERS: ProductFilterValues = {
  search: "",
  categoryId: "all",
  status: PRODUCT_STATUS_FILTERS.all,
}

function getActiveState(
  status: ProductFilterValues["status"],
): boolean | undefined {
  if (status === PRODUCT_STATUS_FILTERS.active) return true
  if (status === PRODUCT_STATUS_FILTERS.inactive) return false
  return undefined
}

function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message
  return "No fue posible cargar los productos."
}

export function useProducts(): UseProductsResult {
  const navigate = useNavigate()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const currentBusinessId = useBusinessContextStore(
    (state) => state.currentBusinessId,
  )
  const context = useBusinessContextStore((state) => state.context)
  const [products, setProducts] = useState<ProductListItemResponse[]>([])
  const [categories, setCategories] = useState<CategoryListItemResponse[]>([])
  const [filters, setFilters] = useState<ProductFilterValues>(INITIAL_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilterValues>(INITIAL_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  function cancel(): void {
    void navigate(APP_PATHS.DASHBOARD)
  }

  const loadProducts = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      if (!accessToken || !currentBusinessId) {
        setProducts([])
        setCategories([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError("")

      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          listProducts(
            {
              businessId: currentBusinessId,
              search: appliedFilters.search,
              categoryId:
                appliedFilters.categoryId === "all"
                  ? undefined
                  : appliedFilters.categoryId,
              isActive: getActiveState(appliedFilters.status),
            },
            accessToken,
            signal,
          ),
          listCategories(
            { businessId: currentBusinessId, type: CategoryType.Sale },
            accessToken,
            signal,
          ),
        ])

        setProducts(productsResponse)
        setCategories(categoriesResponse)
      } catch (exception) {
        if (signal?.aborted) return
        setProducts([])
        setError(getErrorMessage(exception))
      } finally {
        if (!signal?.aborted) setIsLoading(false)
      }
    },
    [accessToken, appliedFilters, currentBusinessId],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function synchronizeProducts(): Promise<void> {
      await loadProducts(controller.signal)
    }

    void synchronizeProducts()
    return () => controller.abort()
  }, [loadProducts])

  function applyFilters(): void {
    setAppliedFilters(filters)
  }

  function clearFilters(): void {
    setFilters(INITIAL_FILTERS)
    setAppliedFilters(INITIAL_FILTERS)
  }

  function viewProduct(productId: string): void {
    void navigate(APP_PATHS.PRODUCT_DETAIL(productId))
  }

  function createProduct(): void {
    void navigate(APP_PATHS.PRODUCT_CREATE)
  }

  return {
    products,
    categories,
    filters,
    currencyCode: context?.currencyCode ?? "PEN",
    canCreate:
      context?.permissions.includes(PRODUCT_PERMISSIONS.create) ?? false,
    isLoading,
    error,
    setFilters,
    applyFilters,
    clearFilters,
    viewProduct,
    createProduct,
    cancel,
  }
}

import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import {
  PRODUCT_PERMISSIONS,
  PRODUCT_STATUS_FILTERS,
} from "~/features/products/constants"
import { listProductCategories } from "~/services/product-categories"
import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"
import {
  deactivateProduct,
  reactivateProduct,
} from "~/services/products/change-product-status"
import { getProductDetail } from "~/services/products/get-product-detail"
import { listProducts } from "~/services/products/list-products"
import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type { ProductFilterValues } from "../../components/product-filters/interfaces"
import type { UseProductsResult } from "./interfaces"

const INITIAL_FILTERS: ProductFilterValues = {
  search: "",
  productCategoryId: "all",
  status: PRODUCT_STATUS_FILTERS.all,
}

function getActiveState(
  status: ProductFilterValues["status"],
): boolean | undefined {
  if (status === PRODUCT_STATUS_FILTERS.active) {
    return true
  }

  if (status === PRODUCT_STATUS_FILTERS.inactive) {
    return false
  }

  return undefined
}

function getErrorMessage(exception: unknown, fallbackMessage: string): string {
  return isApiError(exception) ? exception.message : fallbackMessage
}

export function useProducts(): UseProductsResult {
  const navigate = useNavigate()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const context = useBusinessContextStore((state) => state.context)
  const [products, setProducts] = useState<ProductListItemResponse[]>([])
  const [productCategories, setProductCategories] = useState<
    ProductCategoryResponse[]
  >([])
  const [filters, setFilters] = useState<ProductFilterValues>(INITIAL_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<ProductFilterValues>(INITIAL_FILTERS)
  const [pendingStatusProduct, setPendingStatusProduct] =
    useState<ProductListItemResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [error, setError] = useState("")

  function cancel(): void {
    void navigate(APP_PATHS.DASHBOARD)
  }

  const fetchProducts = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      if (!accessToken || !businessId) {
        setProducts([])
        setProductCategories([])
        setIsLoading(false)
        return
      }

      try {
        const [productsResponse, productCategoriesResponse] = await Promise.all(
          [
            listProducts(
              {
                businessId,
                search: appliedFilters.search,
                productCategoryId:
                  appliedFilters.productCategoryId === "all"
                    ? undefined
                    : appliedFilters.productCategoryId,
                isActive: getActiveState(appliedFilters.status),
              },
              accessToken,
              signal,
            ),
            listProductCategories(
              {
                businessId,
              },
              accessToken,
              signal,
            ),
          ],
        )

        if (!signal?.aborted) {
          setProducts(productsResponse)
          setProductCategories(productCategoriesResponse)
        }
      } catch (exception) {
        if (!signal?.aborted) {
          setProducts([])
          setError(
            getErrorMessage(exception, "No fue posible cargar los productos."),
          )
        }
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

    async function synchronizeProducts(): Promise<void> {
      setProducts([])
      setProductCategories([])
      setIsLoading(true)
      setError("")
      await fetchProducts(controller.signal)
    }

    void synchronizeProducts()
    return () => controller.abort()
  }, [fetchProducts])

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

  function requestStatusChange(product: ProductListItemResponse): void {
    setPendingStatusProduct(product)
  }

  function cancelStatusChange(): void {
    if (!isChangingStatus) {
      setPendingStatusProduct(null)
    }
  }

  async function reloadProducts(): Promise<void> {
    setIsLoading(true)
    setError("")
    await fetchProducts()
  }

  async function confirmStatusChange(): Promise<void> {
    if (
      !pendingStatusProduct ||
      !accessToken ||
      !businessId ||
      isChangingStatus
    ) {
      return
    }

    setIsChangingStatus(true)
    setError("")

    try {
      const productDetail = await getProductDetail(
        {
          businessId,
          productId: pendingStatusProduct.id,
        },
        accessToken,
      )
      const statusRequest = {
        businessId,
        productId: pendingStatusProduct.id,
        version: productDetail.version,
      }

      if (pendingStatusProduct.isActive) {
        await deactivateProduct(statusRequest, accessToken)
      } else {
        await reactivateProduct(statusRequest, accessToken)
      }

      setPendingStatusProduct(null)
      await reloadProducts()
    } catch (exception) {
      setError(
        getErrorMessage(
          exception,
          "No fue posible cambiar el estado del producto.",
        ),
      )
    } finally {
      setIsChangingStatus(false)
    }
  }

  return {
    products,
    productCategories,
    filters,
    pendingStatusProduct,
    currencyCode: context?.currencyCode ?? "PEN",
    canCreate:
      context?.permissions.includes(PRODUCT_PERMISSIONS.create) ?? false,
    canDeactivate:
      context?.permissions.includes(PRODUCT_PERMISSIONS.deactivate) ?? false,
    canReactivate:
      context?.permissions.includes(PRODUCT_PERMISSIONS.reactivate) ?? false,
    isLoading,
    isChangingStatus,
    error,
    setFilters,
    applyFilters,
    clearFilters,
    viewProduct,
    createProduct,
    requestStatusChange,
    cancelStatusChange,
    confirmStatusChange,
    cancel,
  }
}

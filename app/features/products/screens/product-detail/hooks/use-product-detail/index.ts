import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import type { ProductFormValues } from "~/features/products/components/product-form/interfaces"
import { PRODUCT_PERMISSIONS } from "~/features/products/constants"
import { listProductCategories } from "~/services/product-categories"
import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"
import { getProductDetail } from "~/services/products/get-product-detail"
import type { ProductDetailResponse } from "~/services/products/get-product-detail/interfaces"
import { updateProduct } from "~/services/products/update-product"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type {
  ProductDetailScope,
  ScopedProductDetail,
  UseProductDetailResult,
} from "./interfaces"

function getErrorMessage(exception: unknown, fallbackMessage: string): string {
  if (isApiError(exception)) {
    return exception.message
  }

  return fallbackMessage
}

function scopesMatch(
  firstScope: ProductDetailScope,
  secondScope: ProductDetailScope,
): boolean {
  return (
    firstScope.businessId === secondScope.businessId &&
    firstScope.productId === secondScope.productId
  )
}

function includeCurrentProductCategory(
  activeProductCategories: ProductCategoryResponse[],
  product: ProductDetailResponse,
): ProductCategoryResponse[] {
  const includesCurrentCategory = activeProductCategories.some(
    (productCategory) => productCategory.id === product.productCategoryId,
  )

  if (includesCurrentCategory) {
    return activeProductCategories
  }

  return [
    {
      id: product.productCategoryId,
      businessId: product.businessId,
      name: product.productCategoryName,
      color: product.productCategoryColor,
      isDefault: false,
      isActive: false,
      deactivatedAt: null,
      createdAt: "",
      updatedAt: "",
      version: 0,
    },
    ...activeProductCategories,
  ]
}

export function useProductDetail(): UseProductDetailResult {
  const navigate = useNavigate()
  const { productId = "" } = useParams()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const context = useBusinessContextStore((state) => state.context)
  const [scopedProduct, setScopedProduct] =
    useState<ScopedProductDetail | null>(null)
  const [productCategories, setProductCategories] = useState<
    ProductCategoryResponse[]
  >([])
  const [loadedCategoriesScope, setLoadedCategoriesScope] =
    useState<ProductDetailScope | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [categoriesError, setCategoriesError] = useState("")

  const currentScope = useMemo<ProductDetailScope | null>(() => {
    if (!businessId || !productId) {
      return null
    }

    return {
      businessId,
      productId,
    }
  }, [businessId, productId])

  const canUpdate =
    context?.permissions.includes(PRODUCT_PERMISSIONS.update) ?? false
  const product =
    currentScope &&
    scopedProduct &&
    scopesMatch(scopedProduct.scope, currentScope)
      ? scopedProduct.product
      : null
  const categoriesLoadedForCurrentScope =
    currentScope &&
    loadedCategoriesScope &&
    scopesMatch(loadedCategoriesScope, currentScope)
  const isLoading = currentScope !== null && product === null

  const loadProductDetail = useCallback(
    async (
      scope: ProductDetailScope,
      signal?: AbortSignal,
    ): Promise<ProductDetailResponse | null> => {
      if (!accessToken) {
        return null
      }

      try {
        const productResponse = await getProductDetail(
          { businessId: scope.businessId, productId: scope.productId },
          accessToken,
          signal,
        )

        if (!signal?.aborted) {
          setScopedProduct({
            scope,
            product: productResponse,
          })
          setError("")
        }

        return productResponse
      } catch (exception) {
        if (!signal?.aborted) {
          setError(
            getErrorMessage(exception, "No fue posible cargar el producto."),
          )
        }

        return null
      }
    },
    [accessToken],
  )

  const loadAvailableProductCategories = useCallback(
    async (
      scope: ProductDetailScope,
      currentProduct: ProductDetailResponse,
      signal?: AbortSignal,
    ): Promise<void> => {
      if (!accessToken || !canUpdate) {
        return
      }

      try {
        const activeProductCategories = await listProductCategories(
          {
            businessId: scope.businessId,
            isActive: true,
          },
          accessToken,
          signal,
        )

        if (!signal?.aborted) {
          setProductCategories(
            includeCurrentProductCategory(
              activeProductCategories,
              currentProduct,
            ),
          )
          setLoadedCategoriesScope(scope)
          setCategoriesError("")
        }
      } catch (exception) {
        if (!signal?.aborted) {
          setLoadedCategoriesScope(scope)
          setCategoriesError(
            getErrorMessage(
              exception,
              "El producto se cargó, pero no fue posible consultar las categorías disponibles.",
            ),
          )
        }
      }
    },
    [accessToken, canUpdate],
  )

  const initializeProductDetail = useCallback(
    async (signal: AbortSignal): Promise<void> => {
      if (!currentScope) {
        return
      }

      const productResponse = await loadProductDetail(currentScope, signal)

      if (productResponse && canUpdate && !signal.aborted) {
        await loadAvailableProductCategories(
          currentScope,
          productResponse,
          signal,
        )
      }
    },
    [
      canUpdate,
      currentScope,
      loadAvailableProductCategories,
      loadProductDetail,
    ],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function synchronizeProductDetail(): Promise<void> {
      await initializeProductDetail(controller.signal)
    }

    void synchronizeProductDetail()
    return () => controller.abort()
  }, [initializeProductDetail])

  async function submitProduct(values: ProductFormValues): Promise<void> {
    if (
      !product ||
      !accessToken ||
      !currentScope ||
      !canUpdate ||
      !categoriesLoadedForCurrentScope ||
      isSubmitting
    ) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await updateProduct(
        currentScope.businessId,
        currentScope.productId,
        {
          ...values,
          categoryId: product.categoryId,
          version: product.version,
        },
        accessToken,
      )
      await loadProductDetail(currentScope)
    } catch (exception) {
      setError(
        getErrorMessage(exception, "No fue posible actualizar el producto."),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function reloadProduct(): Promise<void> {
    if (!currentScope) {
      return
    }

    await loadProductDetail(currentScope)
  }

  function returnToProducts(): void {
    void navigate(APP_PATHS.PRODUCTS)
  }

  return {
    product,
    productCategories,
    canUpdate,
    isLoading,
    isSubmitting,
    error,
    categoriesError,
    submitProduct,
    reloadProduct,
    returnToProducts,
  }
}

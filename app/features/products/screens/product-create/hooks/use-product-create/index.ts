import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { CategoryType } from "~/services/categories/interfaces"
import { listCategories } from "~/services/categories/list-categories"
import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import { createProduct } from "~/services/products/create-product"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type { ProductFormValues } from "../../components/product-form/interfaces"
import type { UseProductCreateResult } from "./interfaces"

function getErrorMessage(error: unknown, fallback: string): string {
  return isApiError(error) ? error.message : fallback
}

export function useProductCreate(): UseProductCreateResult {
  const navigate = useNavigate()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const [categories, setCategories] = useState<CategoryListItemResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const loadCategories = useCallback(
    async (signal: AbortSignal): Promise<void> => {
      if (!accessToken || !businessId) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError("")

      try {
        const response = await listCategories(
          { businessId, type: CategoryType.Sale, isActive: true },
          accessToken,
          signal,
        )
        setCategories(response)
      } catch (exception) {
        if (!signal.aborted) {
          setError(
            getErrorMessage(exception, "No fue posible cargar las categorías."),
          )
        }
      } finally {
        if (!signal.aborted) setIsLoading(false)
      }
    },
    [accessToken, businessId],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function synchronizeCategories(): Promise<void> {
      await loadCategories(controller.signal)
    }

    void synchronizeCategories()
    return () => controller.abort()
  }, [loadCategories])

  async function submitProduct(values: ProductFormValues): Promise<void> {
    if (!accessToken || !businessId || isSubmitting) return

    setIsSubmitting(true)
    setError("")

    try {
      const product = await createProduct(businessId, values, accessToken)
      navigate(APP_PATHS.PRODUCT_DETAIL(product.id))
    } catch (exception) {
      setError(getErrorMessage(exception, "No fue posible crear el producto."))
    } finally {
      setIsSubmitting(false)
    }
  }

  function cancel(): void {
    navigate(APP_PATHS.PRODUCTS)
  }

  return {
    categories,
    isLoading,
    isSubmitting,
    error,
    submitProduct,
    cancel,
  }
}

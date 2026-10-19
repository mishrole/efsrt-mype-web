import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { PRODUCT_FINANCIAL_CATEGORY_NAME } from "~/features/products/constants"
import type { ProductFormValues } from "~/features/products/components/product-form/interfaces"
import { CategoryType } from "~/services/categories/interfaces"
import { listCategories } from "~/services/categories/list-categories"
import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import { listProductCategories } from "~/services/product-categories"
import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"
import { createProduct } from "~/services/products/create-product"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"
import type { UseProductCreateResult } from "./interfaces"

function getErrorMessage(exception: unknown, fallbackMessage: string): string {
  if (isApiError(exception)) {
    return exception.message
  }

  return fallbackMessage
}

function findProductsFinancialCategory(
  financialCategories: CategoryListItemResponse[],
): CategoryListItemResponse | null {
  return (
    financialCategories.find(
      (financialCategory) =>
        financialCategory.name === PRODUCT_FINANCIAL_CATEGORY_NAME,
    ) ?? null
  )
}

export function useProductCreate(): UseProductCreateResult {
  const navigate = useNavigate()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const [productCategories, setProductCategories] = useState<
    ProductCategoryResponse[]
  >([])
  const [financialCategory, setFinancialCategory] =
    useState<CategoryListItemResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const loadCreationDependencies = useCallback(
    async (signal: AbortSignal): Promise<void> => {
      if (!accessToken || !businessId) {
        setIsLoading(false)
        return
      }

      try {
        const [financialCategoriesResponse, productCategoriesResponse] =
          await Promise.all([
            listCategories(
              {
                businessId,
                type: CategoryType.Sale,
                isActive: true,
              },
              accessToken,
              signal,
            ),
            listProductCategories(
              {
                businessId,
                isActive: true,
              },
              accessToken,
              signal,
            ),
          ])

        if (signal.aborted) {
          return
        }

        const productsFinancialCategory = findProductsFinancialCategory(
          financialCategoriesResponse,
        )

        setProductCategories(productCategoriesResponse)
        setFinancialCategory(productsFinancialCategory)
        setError(
          productsFinancialCategory
            ? ""
            : 'No existe una categoría financiera activa SALE llamada "Productos".',
        )
      } catch (exception) {
        if (!signal.aborted) {
          setError(
            getErrorMessage(
              exception,
              "No fue posible cargar las categorías necesarias.",
            ),
          )
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false)
        }
      }
    },
    [accessToken, businessId],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function synchronizeCreationDependencies(): Promise<void> {
      await loadCreationDependencies(controller.signal)
    }

    void synchronizeCreationDependencies()
    return () => controller.abort()
  }, [loadCreationDependencies])

  async function submitProduct(values: ProductFormValues): Promise<void> {
    if (!accessToken || !businessId || !financialCategory || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await createProduct(
        businessId,
        {
          ...values,
          categoryId: financialCategory.id,
        },
        accessToken,
      )
      void navigate(APP_PATHS.PRODUCTS)
    } catch (exception) {
      setError(getErrorMessage(exception, "No fue posible crear el producto."))
    } finally {
      setIsSubmitting(false)
    }
  }

  function returnToProducts(): void {
    void navigate(APP_PATHS.PRODUCTS)
  }

  return {
    productCategories,
    isLoading,
    isSubmitting,
    error,
    canSubmit: financialCategory !== null && productCategories.length > 0,
    submitProduct,
    returnToProducts,
  }
}

import { ArrowLeftIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { ProductCategoryForm } from "~/features/product-categories/components/product-category-form"
import type { ProductCategoryFormValues } from "~/features/product-categories/components/product-category-form/schema"
import {
  getProductCategoryDetail,
  updateProductCategory,
} from "~/services/product-categories"
import type { ProductCategoryResponse } from "~/services/product-categories/interfaces"
import { Button } from "~/shared/components/ui/button"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"

export function meta() {
  return [{ title: "Editar categoría de producto | Mype" }]
}
function getErrorMessage(exception: unknown, fallbackMessage: string): string {
  if (isApiError(exception)) {
    return exception.message
  }
  return fallbackMessage
}

export default function ProductCategoryDetailScreen() {
  const navigate = useNavigate()
  const { productCategoryId = "" } = useParams()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const [category, setCategory] = useState<ProductCategoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const loadCategory = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      if (!accessToken || !businessId || !productCategoryId) {
        setCategory(null)
        setIsLoading(false)
        return
      }
      setCategory(null)
      setIsLoading(true)
      setError("")
      try {
        setCategory(
          await getProductCategoryDetail(
            businessId,
            productCategoryId,
            accessToken,
            signal,
          ),
        )
      } catch (exception) {
        if (!signal?.aborted) {
          setError(
            getErrorMessage(
              exception,
              "No fue posible cargar la categoría de producto.",
            ),
          )
        }
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false)
        }
      }
    },
    [accessToken, businessId, productCategoryId],
  )

  useEffect(() => {
    const controller = new AbortController()
    async function synchronizeProductCategory(): Promise<void> {
      await loadCategory(controller.signal)
    }
    void synchronizeProductCategory()
    return () => controller.abort()
  }, [loadCategory])

  function returnToProductCategories(): void {
    void navigate(APP_PATHS.PRODUCT_CATEGORIES)
  }

  async function submitProductCategory(
    values: ProductCategoryFormValues,
  ): Promise<void> {
    if (!category || !accessToken || !businessId || isSubmitting) {
      return
    }
    setIsSubmitting(true)
    setError("")
    try {
      setCategory(
        await updateProductCategory(
          businessId,
          category.id,
          { ...values, version: category.version },
          accessToken,
        ),
      )

      returnToProductCategories()
    } catch (exception) {
      setError(
        getErrorMessage(
          exception,
          "No fue posible actualizar la categoría de producto.",
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] p-8 text-center">
        Cargando categoría...
      </main>
    )
  }

  return (
    <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
      <div className="mx-auto grid w-full max-w-[760px] gap-6">
        <header className="flex flex-col items-start">
          <Button
            variant="ghost"
            className="mb-3 px-0 hover:bg-transparent"
            onClick={returnToProductCategories}
          >
            <ArrowLeftIcon data-icon="inline-end" aria-hidden="true" />
            Volver a categorías
          </Button>
          <span className="text-xs font-extrabold tracking-[0.1em] text-[#2b5fce] uppercase">
            Catálogo
          </span>
          <h1 className="my-1 text-3xl font-bold tracking-[-0.035em] text-[#15233e]">
            Editar categoría
          </h1>
          <p className="m-0 text-[#667085]">
            Actualiza el nombre y color de {category?.name ?? "la categoría"}.
          </p>
        </header>
        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#f0c7cf] bg-[#fff5f6] p-4 text-[#9f243b]"
          >
            {error}
          </div>
        ) : null}
        {category ? (
          <ProductCategoryForm
            defaultValues={{ name: category.name, color: category.color }}
            isSubmitting={isSubmitting}
            submitLabel="Guardar cambios"
            onSubmit={submitProductCategory}
            onCancel={returnToProductCategories}
          />
        ) : null}
      </div>
    </main>
  )
}

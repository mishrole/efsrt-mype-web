import { ArrowLeftIcon } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { useBusinessContextStore } from "~/features/business/stores/business-context"
import { ProductCategoryForm } from "~/features/product-categories/components/product-category-form"
import type { ProductCategoryFormValues } from "~/features/product-categories/components/product-category-form/schema"
import { createProductCategory } from "~/services/product-categories"
import { Button } from "~/shared/components/ui/button"
import { APP_PATHS } from "~/shared/constants/pages"
import { isApiError } from "~/shared/http/errors"

export function meta() {
  return [{ title: "Nueva categoría de producto | Mype" }]
}

export default function ProductCategoryCreateScreen() {
  const navigate = useNavigate()
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const businessId = useBusinessContextStore((state) => state.currentBusinessId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  function returnToProductCategories(): void {
    void navigate(APP_PATHS.PRODUCT_CATEGORIES)
  }

  async function submitProductCategory(
    values: ProductCategoryFormValues,
  ): Promise<void> {
    if (!accessToken || !businessId || isSubmitting) {
      return
    }
    setIsSubmitting(true)
    setError("")
    try {
      await createProductCategory(businessId, values, accessToken)
      void navigate(APP_PATHS.PRODUCT_CATEGORIES)
    } catch (exception) {
      setError(
        isApiError(exception)
          ? exception.message
          : "No fue posible crear la categoría de producto.",
      )
    } finally {
      setIsSubmitting(false)
    }
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
            Nueva categoría
          </h1>
          <p className="m-0 text-[#667085]">
            Crea una categoría para organizar los productos del negocio.
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
        <ProductCategoryForm
          isSubmitting={isSubmitting}
          submitLabel="Crear categoría"
          onSubmit={submitProductCategory}
          onCancel={returnToProductCategories}
        />
      </div>
    </main>
  )
}

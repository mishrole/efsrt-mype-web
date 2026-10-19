import { ArrowLeftIcon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import { ProductForm } from "./components/product-form"
import { useProductCreate } from "./hooks/use-product-create"

export function meta() {
  return [{ title: "Nuevo producto | Mype" }]
}

export default function ProductCreateScreen() {
  const productCreateState = useProductCreate()

  return (
    <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
      <div className="mx-auto grid w-full max-w-[760px] gap-6">
        <header className="flex flex-col items-start">
          <Button
            variant="ghost"
            className="mb-3 px-0 hover:bg-transparent"
            onClick={productCreateState.cancel}
          >
            <ArrowLeftIcon data-icon="inline-end" aria-hidden="true" />
            Volver a productos
          </Button>
          <span className="text-xs font-extrabold tracking-[0.1em] text-[#2b5fce] uppercase">
            Catálogo
          </span>
          <h1 className="my-1 text-3xl font-bold tracking-[-0.035em] text-[#15233e]">
            Nuevo producto
          </h1>
          <p className="m-0 text-[#667085]">
            Registra un producto disponible para las ventas de tu negocio.
          </p>
        </header>

        {productCreateState.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#f0c7cf] bg-[#fff5f6] p-4 text-[#9f243b]"
          >
            {productCreateState.error}
          </div>
        ) : null}

        {productCreateState.isLoading ? (
          <p className="m-0 rounded-2xl border border-[#e1e6ef] bg-white p-6 text-center text-[#667085]">
            Cargando categorías...
          </p>
        ) : (
          <ProductForm
            categories={productCreateState.categories}
            isSubmitting={productCreateState.isSubmitting}
            onSubmit={productCreateState.submitProduct}
            onCancel={productCreateState.cancel}
          />
        )}
      </div>
    </main>
  )
}

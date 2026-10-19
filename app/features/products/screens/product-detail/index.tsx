import { ArrowLeftIcon } from "lucide-react"
import { ProductForm } from "~/features/products/components/product-form"
import { Button } from "~/shared/components/ui/button"
import { useProductDetail } from "./hooks/use-product-detail"

export function meta() {
  return [{ title: "Detalle de producto | Mype" }]
}

export default function ProductDetailScreen() {
  const productDetailState = useProductDetail()

  if (productDetailState.isLoading) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] p-8 text-center text-[#667085]">
        Cargando producto...
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
            onClick={productDetailState.returnToProducts}
          >
            <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
            Volver a productos
          </Button>
          <span className="text-xs font-extrabold tracking-[0.1em] text-[#2b5fce] uppercase">
            Catálogo
          </span>
          <h1 className="my-1 text-3xl font-bold tracking-[-0.035em] text-[#15233e]">
            Detalle de producto
          </h1>
          <p className="m-0 text-[#667085]">
            Consulta y actualiza la información de{" "}
            {productDetailState.product?.name ?? "este producto"}.
          </p>
        </header>

        {productDetailState.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#f0c7cf] bg-[#fff5f6] p-4 text-[#9f243b]"
          >
            {productDetailState.error}
          </div>
        ) : null}

        {productDetailState.categoriesError ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#efd9a7] bg-[#fffaf0] p-4 text-[#835b13]"
          >
            {productDetailState.categoriesError}
          </div>
        ) : null}

        {productDetailState.product ? (
          <ProductForm
            key={`${productDetailState.product.id}-${productDetailState.product.version}`}
            productCategories={productDetailState.productCategories}
            defaultValues={{
              name: productDetailState.product.name,
              productCategoryId:
                productDetailState.product.productCategoryId,
              salePrice: productDetailState.product.salePrice,
              unitCost: productDetailState.product.unitCost,
            }}
            isSubmitting={productDetailState.isSubmitting}
            isReadOnly={
              !productDetailState.canUpdate ||
              Boolean(productDetailState.categoriesError)
            }
            submitLabel="Guardar cambios"
            onSubmit={productDetailState.submitProduct}
            onCancel={productDetailState.returnToProducts}
          />
        ) : null}
      </div>
    </main>
  )
}

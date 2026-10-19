import { PackagePlusIcon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import { ProductCard } from "./components/product-card"
import { ProductFilters } from "./components/product-filters"
import { ProductStatusDialog } from "./components/product-status-dialog"
import { useProducts } from "./hooks/use-products"

export function meta() {
  return [{ title: "Productos | Mype" }]
}

export default function ProductListScreen() {
  const productsState = useProducts()

  return (
    <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
      <div className="mx-auto grid w-full max-w-[1180px] gap-6">
        <header className="flex flex-col gap-4 min-[641px]:flex-row min-[641px]:items-end min-[641px]:justify-between">
          <div>
            <span className="text-xs font-extrabold tracking-[0.1em] text-[#2b5fce] uppercase">
              Catálogo
            </span>
            <h1 className="my-1 text-3xl font-bold tracking-[-0.035em] text-[#15233e]">
              Productos
            </h1>
            <p className="m-0 text-[#667085]">
              Consulta los productos, sus precios y su coste unitario
              referencial.
            </p>
          </div>
          {productsState.canCreate ? (
            <Button onClick={productsState.createProduct}>
              <PackagePlusIcon data-icon="inline-start" aria-hidden="true" />
              Nuevo producto
            </Button>
          ) : null}
        </header>

        <ProductFilters
          productCategories={productsState.productCategories}
          values={productsState.filters}
          disabled={
            productsState.isLoading || productsState.isChangingStatus
          }
          onChange={productsState.setFilters}
          onApply={productsState.applyFilters}
          onClear={productsState.clearFilters}
        />

        {productsState.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#f0c7cf] bg-[#fff5f6] p-4 text-[#9f243b]"
          >
            {productsState.error}
          </div>
        ) : null}

        {productsState.isLoading ? (
          <p className="m-0 rounded-2xl border border-[#e1e6ef] bg-white p-6 text-center text-[#667085]">
            Cargando productos...
          </p>
        ) : null}

        {!productsState.isLoading &&
        !productsState.error &&
        productsState.products.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-[#b8c7e5] bg-white p-8 text-center">
            <h2 className="m-0 text-xl">No se encontraron productos</h2>
            <p className="mt-2 mb-0 text-[#667085]">
              Prueba otros filtros o crea el primer producto.
            </p>
          </section>
        ) : null}

        {!productsState.isLoading && productsState.products.length > 0 ? (
          <section className="grid gap-3" aria-label="Listado de productos">
            {productsState.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currencyCode={productsState.currencyCode}
                canChangeStatus={
                  product.isActive
                    ? productsState.canDeactivate
                    : productsState.canReactivate
                }
                isChangingStatus={productsState.isChangingStatus}
                onView={productsState.viewProduct}
                onRequestStatusChange={productsState.requestStatusChange}
              />
            ))}
          </section>
        ) : null}
      </div>

      <ProductStatusDialog
        product={productsState.pendingStatusProduct}
        isSubmitting={productsState.isChangingStatus}
        onClose={productsState.cancelStatusChange}
        onConfirm={productsState.confirmStatusChange}
      />
    </main>
  )
}

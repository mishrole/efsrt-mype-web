import { ArrowLeftIcon, FolderPlusIcon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import { ProductCategoryCard } from "./components/product-category-card"
import { ProductCategoryFilters } from "./components/product-category-filters"
import { ProductCategoryStatusDialog } from "./components/product-category-status-dialog"
import { useProductCategories } from "./hooks/use-product-categories"

export function meta() {
  return [{ title: "Categorías de producto | Mype" }]
}

export default function ProductCategoryListScreen() {
  const productCategoriesState = useProductCategories()

  return (
    <main className="min-h-screen min-w-80 bg-[#f5f7fb] px-3.5 py-6 text-[#172033] min-[641px]:px-6">
      <div className="mx-auto grid w-full max-w-[1180px] gap-6">
        <header className="flex flex-col gap-4 min-[641px]:flex-row min-[641px]:items-end min-[641px]:justify-between">
          <div>
            <Button
              variant="ghost"
              className="mb-3 px-0 hover:bg-transparent cursor-pointer"
              onClick={productCategoriesState.cancel}
            >
              <ArrowLeftIcon data-icon="inline-end" aria-hidden="true" />
              Volver a dashboard
            </Button>
            <span className="block text-xs font-extrabold tracking-[0.1em] text-[#2b5fce] uppercase">
              Catálogo
            </span>
            <h1 className="my-1 text-3xl font-bold tracking-[-0.035em] text-[#15233e]">
              Categorías de producto
            </h1>
            <p className="m-0 text-[#667085]">
              Organiza los productos del negocio antes de registrarlos.
            </p>
          </div>
          {productCategoriesState.canCreate ? (
            <Button onClick={productCategoriesState.createProductCategory}>
              <FolderPlusIcon data-icon="inline-start" aria-hidden="true" />
              Nueva categoría
            </Button>
          ) : null}
        </header>
        <ProductCategoryFilters
          values={productCategoriesState.filters}
          disabled={
            productCategoriesState.isLoading ||
            productCategoriesState.isChangingStatus
          }
          onChange={productCategoriesState.setFilters}
          onApply={productCategoriesState.applyFilters}
          onClear={productCategoriesState.clearFilters}
        />
        {productCategoriesState.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-[#f0c7cf] bg-[#fff5f6] p-4 text-[#9f243b]"
          >
            {productCategoriesState.error}
          </div>
        ) : null}
        {productCategoriesState.isLoading ? (
          <p className="m-0 rounded-2xl border border-[#e1e6ef] bg-white p-6 text-center text-[#667085]">
            Cargando categorías...
          </p>
        ) : null}
        {!productCategoriesState.isLoading &&
        !productCategoriesState.error &&
        productCategoriesState.productCategories.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-[#b8c7e5] bg-white p-8 text-center">
            <h2 className="m-0 text-xl">No se encontraron categorías</h2>
            <p className="mt-2 mb-0 text-[#667085]">
              Prueba otros filtros o crea la primera categoría de producto.
            </p>
          </section>
        ) : null}
        {!productCategoriesState.isLoading &&
        productCategoriesState.productCategories.length > 0 ? (
          <section
            className="grid gap-3"
            aria-label="Listado de categorías de producto"
          >
            {productCategoriesState.productCategories.map((category) => (
              <ProductCategoryCard
                key={category.id}
                category={category}
                canUpdate={productCategoriesState.canUpdate}
                canChangeStatus={
                  category.isActive
                    ? productCategoriesState.canDeactivate
                    : productCategoriesState.canReactivate
                }
                isChangingStatus={productCategoriesState.isChangingStatus}
                onEdit={productCategoriesState.editProductCategory}
                onRequestStatusChange={
                  productCategoriesState.requestStatusChange
                }
              />
            ))}
          </section>
        ) : null}
      </div>
      <ProductCategoryStatusDialog
        category={productCategoriesState.pendingStatusCategory}
        isSubmitting={productCategoriesState.isChangingStatus}
        onClose={productCategoriesState.cancelStatusChange}
        onConfirm={productCategoriesState.confirmStatusChange}
      />
    </main>
  )
}

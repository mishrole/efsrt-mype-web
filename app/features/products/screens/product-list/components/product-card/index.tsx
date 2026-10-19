import { ChevronRightIcon, PowerIcon, RotateCcwIcon } from "lucide-react"
import { Badge } from "~/shared/components/ui/badge"
import { Button } from "~/shared/components/ui/button"
import type { ProductCardProps } from "./interfaces"
import { formatMoney } from "./utils"

export function ProductCard({
  product,
  currencyCode,
  canChangeStatus,
  isChangingStatus,
  onView,
  onRequestStatusChange,
}: Readonly<ProductCardProps>) {
  function handleView(): void {
    onView(product.id)
  }

  function handleStatusChangeRequest(): void {
    onRequestStatusChange(product)
  }

  return (
    <article className="grid gap-4 rounded-2xl border border-[#e1e6ef] bg-white p-4 shadow-sm min-[721px]:grid-cols-[minmax(0,1fr)_auto] min-[721px]:items-center min-[721px]:p-5">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className="size-3 rounded-full"
            style={{ backgroundColor: product.productCategoryColor }}
            aria-hidden="true"
          />
          <h2 className="m-0 truncate text-base font-bold text-[#172033]">
            {product.name}
          </h2>
          <Badge variant={product.isActive ? "secondary" : "outline"}>
            {product.isActive ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <p className="m-0 text-sm text-[#667085]">
          {product.productCategoryName}
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <dt className="text-xs font-bold text-[#748096] uppercase">
              Precio de venta
            </dt>
            <dd className="m-0 mt-1 font-semibold text-[#263653]">
              {formatMoney(product.salePrice, currencyCode)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-[#748096] uppercase">
              Coste referencial
            </dt>
            <dd className="m-0 mt-1 font-semibold text-[#263653]">
              {formatMoney(product.unitCost, currencyCode)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-col gap-2 min-[481px]:flex-row">
        {canChangeStatus ? (
          <Button
            type="button"
            variant="outline"
            disabled={isChangingStatus}
            onClick={handleStatusChangeRequest}
          >
            {product.isActive ? (
              <PowerIcon data-icon="inline-start" aria-hidden="true" />
            ) : (
              <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
            )}
            {product.isActive ? "Desactivar" : "Reactivar"}
          </Button>
        ) : null}
        <Button type="button" variant="outline" onClick={handleView}>
          Ver detalle
          <ChevronRightIcon data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
    </article>
  )
}

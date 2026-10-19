import { ChevronRightIcon, PowerIcon, RotateCcwIcon } from "lucide-react"
import { Badge } from "~/shared/components/ui/badge"
import { Button } from "~/shared/components/ui/button"
import type { ProductCategoryCardProps } from "./interfaces"

export function ProductCategoryCard({
  category,
  canUpdate,
  canChangeStatus,
  isChangingStatus,
  onEdit,
  onRequestStatusChange,
}: Readonly<ProductCategoryCardProps>) {
  function handleEdit(): void {
    onEdit(category.id)
  }

  function handleRequestStatusChange(): void {
    onRequestStatusChange(category)
  }

  return (
    <article className="grid gap-4 rounded-2xl border border-[#e1e6ef] bg-white p-4 shadow-sm min-[721px]:grid-cols-[minmax(0,1fr)_auto] min-[721px]:items-center min-[721px]:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="size-10 flex-none rounded-xl"
          style={{ backgroundColor: category.color }}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="m-0 truncate text-base font-bold text-[#172033]">
              {category.name}
            </h2>
            <Badge variant={category.isActive ? "secondary" : "outline"}>
              {category.isActive ? "Activa" : "Inactiva"}
            </Badge>
            {category.isDefault ? (
              <Badge variant="outline">Predeterminada</Badge>
            ) : null}
          </div>
          <p className="mt-1 mb-0 text-sm text-[#667085]">
            Clasificación para el catálogo de productos.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 min-[481px]:flex-row">
        {canChangeStatus && !category.isDefault ? (
          <Button
            variant="outline"
            disabled={isChangingStatus}
            onClick={handleRequestStatusChange}
          >
            {category.isActive ? (
              <PowerIcon data-icon="inline-start" aria-hidden="true" />
            ) : (
              <RotateCcwIcon data-icon="inline-start" aria-hidden="true" />
            )}
            {category.isActive ? "Desactivar" : "Reactivar"}
          </Button>
        ) : null}
        {canUpdate ? (
          <Button variant="outline" onClick={handleEdit}>
            Editar
            <ChevronRightIcon data-icon="inline-end" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    </article>
  )
}

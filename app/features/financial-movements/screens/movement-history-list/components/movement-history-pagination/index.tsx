import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import type { MovementHistoryPaginationProps } from "./interfaces"

export function MovementHistoryPagination({
  page,
  pageSize,
  totalCount,
  hasPreviousPage,
  hasNextPage,
  disabled = false,
  onPreviousPage,
  onNextPage,
}: Readonly<MovementHistoryPaginationProps>) {
  const firstItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const lastItem = Math.min(page * pageSize, totalCount)

  return (
    <nav
      className="flex flex-col gap-3 rounded-2xl border border-[#e1e6ef] bg-white p-4 min-[641px]:flex-row min-[641px]:items-center min-[641px]:justify-between"
      aria-label="Paginación del historial"
    >
      <p className="m-0 text-sm text-[#667085]">
        Mostrando {firstItem}-{lastItem} de {totalCount} movimientos
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !hasPreviousPage}
          onClick={onPreviousPage}
        >
          <ChevronLeftIcon data-icon="inline-start" aria-hidden="true" />
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || !hasNextPage}
          onClick={onNextPage}
        >
          Siguiente
          <ChevronRightIcon data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}

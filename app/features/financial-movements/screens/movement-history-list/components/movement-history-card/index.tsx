import { ArrowRightIcon, PaperclipIcon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import { formatDateTime } from "~/shared/utils/date"
import { formatMoney } from "~/shared/utils/money"
import type { MovementHistoryCardProps } from "./interfaces"
import {
  getMovementStatusClasses,
  getMovementStatusLabel,
  getMovementTypeLabel,
} from "./utils"

export function MovementHistoryCard({
  movement,
  onView,
}: Readonly<MovementHistoryCardProps>) {
  function viewMovement(): void {
    onView(movement.id)
  }

  const statusDate =
    movement.cancelledAt ?? movement.discardedAt ?? movement.confirmedAt

  return (
    <article className="grid gap-4 rounded-2xl border border-[#e1e6ef] bg-white p-4 shadow-sm min-[721px]:grid-cols-[minmax(0,1fr)_auto] min-[721px]:items-center min-[721px]:p-5">
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="m-0 text-base font-bold text-[#172033]">
            {getMovementTypeLabel(movement.type)}
          </h2>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${getMovementStatusClasses(movement.status)}`}
          >
            {getMovementStatusLabel(movement.status)}
          </span>
          {movement.hasActiveEvidence ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#596579]">
              <PaperclipIcon className="size-3.5" aria-hidden="true" />
              Con evidencia
            </span>
          ) : null}
        </div>
        <p className="m-0 text-sm text-[#667085]">
          {movement.description || "Sin descripción"}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#46536b]">
          <span>Fecha: {movement.movementDate}</span>
          <span>
            {movement.activeItemCount} ítem
            {movement.activeItemCount === 1 ? "" : "s"}
          </span>
          {statusDate ? (
            <span>Actualizado: {formatDateTime(statusDate)}</span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 min-[721px]:justify-end">
        <strong className="text-lg text-[#172033]">
          {formatMoney(movement.totalAmount, movement.currencyCode)}
        </strong>
        <Button type="button" variant="outline" onClick={viewMovement}>
          Ver detalle
          <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
        </Button>
      </div>
    </article>
  )
}

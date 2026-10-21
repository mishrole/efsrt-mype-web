import { ArrowRightIcon } from "lucide-react"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import { Button } from "~/shared/components/ui/button"
import { formatDateTime } from "~/shared/utils/date"
import { formatMoney } from "~/shared/utils/money"
import type { MovementDraftCardProps } from "./interfaces"

export function MovementDraftCard({
  movement,
  onView,
}: Readonly<MovementDraftCardProps>) {
  function viewMovement(): void {
    onView(movement.id)
  }

  return (
    <article className="grid gap-4 rounded-2xl border border-[#e1e6ef] bg-white p-4 shadow-sm min-[641px]:grid-cols-[minmax(0,1fr)_auto] min-[641px]:items-center min-[641px]:p-5">
      <div className="grid gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="m-0 text-base font-bold text-[#172033]">
            {movement.type === FINANCIAL_MOVEMENT_TYPES.sale
              ? "Venta"
              : "Gasto"}
          </h2>
          <span className="rounded-full bg-[#eef4ff] px-2.5 py-1 text-xs font-bold text-[#2b5fce]">
            Borrador
          </span>
        </div>
        <p className="m-0 text-sm text-[#667085]">
          {movement.description || "Sin descripción"}
        </p>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#46536b]">
          <span>
            Última actualización: {formatDateTime(movement.updatedAt)}
          </span>

          <span>Fecha de movimiento: {movement.movementDate}</span>

          <strong>
            Total: {formatMoney(movement.totalAmount, movement.currencyCode)}
          </strong>
        </div>
      </div>
      <Button type="button" variant="outline" onClick={viewMovement}>
        Abrir
        <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
      </Button>
    </article>
  )
}

import { formatDateTime } from "~/shared/utils/date"
import { formatMoney } from "~/shared/utils/money"
import {
  getMovementStatusClasses,
  getMovementStatusLabel,
  getMovementTypeLabel,
} from "../../../movement-history-list/components/movement-history-card/utils"
import type { MovementHistoryDetailSummaryProps } from "./interfaces"

export function MovementHistoryDetailSummary({
  movement,
}: Readonly<MovementHistoryDetailSummaryProps>) {
  return (
    <section
      className="grid gap-5 rounded-2xl border border-[#e1e6ef] bg-white p-5 shadow-sm"
      aria-labelledby="movement-summary-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="movement-summary-title" className="m-0 text-xl font-bold">
            {getMovementTypeLabel(movement.type)}
          </h2>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${getMovementStatusClasses(movement.status)}`}
          >
            {getMovementStatusLabel(movement.status)}
          </span>
        </div>
        <strong className="text-2xl text-[#172033]">
          {formatMoney(movement.totalAmount, movement.currencyCode)}
        </strong>
      </div>

      <dl className="grid gap-4 min-[641px]:grid-cols-2">
        <div>
          <dt className="text-xs font-bold text-[#748096] uppercase">
            Fecha del movimiento
          </dt>
          <dd className="mt-1 ml-0">{movement.movementDate}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold text-[#748096] uppercase">
            Descripción
          </dt>
          <dd className="mt-1 ml-0">
            {movement.description || "Sin descripción"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold text-[#748096] uppercase">Creado</dt>
          <dd className="mt-1 ml-0">{formatDateTime(movement.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold text-[#748096] uppercase">
            Última actualización
          </dt>
          <dd className="mt-1 ml-0">{formatDateTime(movement.updatedAt)}</dd>
        </div>
        {movement.confirmedAt ? (
          <div>
            <dt className="text-xs font-bold text-[#748096] uppercase">
              Confirmado
            </dt>
            <dd className="mt-1 ml-0">
              {formatDateTime(movement.confirmedAt)}
            </dd>
          </div>
        ) : null}
        {movement.cancelledAt ? (
          <div>
            <dt className="text-xs font-bold text-[#748096] uppercase">
              Anulado
            </dt>
            <dd className="mt-1 ml-0">
              {formatDateTime(movement.cancelledAt)}
            </dd>
          </div>
        ) : null}
        {movement.discardedAt ? (
          <div>
            <dt className="text-xs font-bold text-[#748096] uppercase">
              Descartado
            </dt>
            <dd className="mt-1 ml-0">
              {formatDateTime(movement.discardedAt)}
            </dd>
          </div>
        ) : null}
        {movement.cancellationReason ? (
          <div className="min-[641px]:col-span-2">
            <dt className="text-xs font-bold text-[#748096] uppercase">
              Motivo de anulación
            </dt>
            <dd className="mt-1 ml-0">{movement.cancellationReason}</dd>
          </div>
        ) : null}
      </dl>

      {movement.estimatedCost !== null || movement.estimatedMargin !== null ? (
        <div className="grid gap-3 rounded-xl bg-[#f6f8fc] p-4 min-[481px]:grid-cols-2">
          <div>
            <span className="block text-xs font-bold text-[#748096] uppercase">
              Costo estimado
            </span>
            <strong>
              {formatMoney(movement.estimatedCost ?? 0, movement.currencyCode)}
            </strong>
          </div>
          <div>
            <span className="block text-xs font-bold text-[#748096] uppercase">
              Margen estimado
            </span>
            <strong>
              {formatMoney(
                movement.estimatedMargin ?? 0,
                movement.currencyCode,
              )}
            </strong>
          </div>
        </div>
      ) : null}
    </section>
  )
}

import { AlertTriangleIcon } from "lucide-react"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import { Button } from "~/shared/components/ui/button"
import { formatMoney } from "~/shared/utils/money"
import type { ConfirmFinancialMovementDialogProps } from "./interfaces"

export function ConfirmFinancialMovementDialog({
  isOpen,
  isConfirming,
  movementType,
  movementDate,
  totalAmount,
  currencyCode,
  itemCount,
  onCancel,
  onConfirm,
}: Readonly<ConfirmFinancialMovementDialogProps>) {
  if (!isOpen) {
    return null
  }

  const movementLabel =
    movementType === FINANCIAL_MOVEMENT_TYPES.sale ? "venta" : "gasto"

  function confirmMovement(): void {
    void onConfirm()
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-movement-title"
        aria-describedby="confirm-movement-description"
        className="grid w-full max-w-lg gap-5 rounded-2xl bg-white p-6 shadow-xl"
      >
        <header className="flex items-start gap-3">
          <AlertTriangleIcon
            className="mt-1 text-amber-600"
            aria-hidden="true"
          />
          <div>
            <h2 id="confirm-movement-title" className="m-0 text-xl font-bold">
              Confirmar {movementLabel}
            </h2>
            <p
              id="confirm-movement-description"
              className="mt-2 mb-0 text-sm text-muted-foreground"
            >
              El movimiento dejará de ser editable y se incorporará al historial
              financiero.
            </p>
          </div>
        </header>

        <dl className="grid gap-3 rounded-xl bg-muted/50 p-4 min-[481px]:grid-cols-2">
          <div>
            <dt className="text-xs font-bold text-muted-foreground uppercase">
              Fecha
            </dt>
            <dd className="m-0 mt-1 font-semibold">{movementDate}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-muted-foreground uppercase">
              Total
            </dt>
            <dd className="m-0 mt-1 font-semibold">
              {formatMoney(totalAmount, currencyCode)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-muted-foreground uppercase">
              Ítems activos
            </dt>
            <dd className="m-0 mt-1 font-semibold">{itemCount}</dd>
          </div>
        </dl>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={isConfirming}
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={isConfirming || itemCount === 0}
            onClick={confirmMovement}
          >
            {isConfirming ? "Confirmando..." : "Confirmar movimiento"}
          </Button>
        </div>
      </section>
    </div>
  )
}

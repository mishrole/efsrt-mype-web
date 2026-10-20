import { PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "~/shared/components/ui/button"
import { formatMoney } from "~/shared/utils/money"
import type { FinancialMovementItemCardProps } from "./interfaces"

export function FinancialMovementItemCard({
  item,
  currencyCode,
  isSale,
  isBusy,
  onEdit,
  onRetire,
}: Readonly<FinancialMovementItemCardProps>) {
  function editItem(): void {
    onEdit(item)
  }
  function retireItem(): void {
    onRetire(item)
  }
  return (
    <article className="grid gap-4 rounded-xl border p-4 min-[721px]:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(100px,0.6fr))_auto] min-[721px]:items-center">
      <div>
        <strong>{isSale ? item.productName : item.description}</strong>
        <p className="m-0 text-sm text-muted-foreground">{item.categoryName}</p>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">Cantidad</span>
        <p className="m-0 font-semibold">{item.quantity}</p>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">Importe</span>
        <p className="m-0 font-semibold">
          {formatMoney(item.unitAmount, currencyCode)}
        </p>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">Subtotal</span>
        <p className="m-0 font-semibold">
          {formatMoney(item.subtotalAmount, currencyCode)}
        </p>
        {isSale ? (
          <small>
            Margen: {formatMoney(item.estimatedMargin ?? 0, currencyCode)}
          </small>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          onClick={editItem}
        >
          <PencilIcon aria-hidden="true" />
          Editar
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={isBusy}
          onClick={retireItem}
        >
          <Trash2Icon aria-hidden="true" />
          Retirar
        </Button>
      </div>
    </article>
  )
}

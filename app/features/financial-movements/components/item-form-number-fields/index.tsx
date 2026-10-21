import type { ItemFormNumberFieldsProps } from "./interfaces"

export function ItemFormNumberFields({
  quantityInput,
  quantityError,
  unitAmountInput,
  unitAmountError,
}: Readonly<ItemFormNumberFieldsProps>) {
  return (
    <>
      <label className="grid gap-2">
        <span>Cantidad</span>
        {quantityInput}
        <span className="text-sm text-destructive">{quantityError}</span>
      </label>
      <label className="grid gap-2">
        <span>Importe unitario</span>
        {unitAmountInput}
        <span className="text-sm text-destructive">{unitAmountError}</span>
      </label>
    </>
  )
}

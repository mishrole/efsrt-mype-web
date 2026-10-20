import { ExpenseItemForm } from "~/features/financial-movements/components/expense-item-form"
import { SaleItemForm } from "~/features/financial-movements/components/sale-item-form"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import type { FinancialMovementItemModalProps } from "./interfaces"

export function FinancialMovementItemModal({
  isOpen,
  movementType,
  item,
  products,
  categories,
  isSubmitting,
  onClose,
  onSubmitSale,
  onSubmitExpense,
}: Readonly<FinancialMovementItemModalProps>) {
  if (!isOpen) {
    return null
  }
  const isSale = movementType === FINANCIAL_MOVEMENT_TYPES.sale
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="movement-item-modal-title"
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="movement-item-modal-title" className="mt-0">
          {item ? "Editar" : "Agregar"} {isSale ? "producto" : "concepto"}
        </h2>
        {isSale ? (
          <SaleItemForm
            products={products}
            item={item}
            isSubmitting={isSubmitting}
            onSubmit={onSubmitSale}
            onCancel={onClose}
          />
        ) : (
          <ExpenseItemForm
            categories={categories}
            item={item}
            isSubmitting={isSubmitting}
            onSubmit={onSubmitExpense}
            onCancel={onClose}
          />
        )}
      </section>
    </div>
  )
}

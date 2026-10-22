import { formatMoney } from "~/shared/utils/money"
import type { MovementHistoryDetailItemsProps } from "./interfaces"

export function MovementHistoryDetailItems({
  items,
  currencyCode,
}: Readonly<MovementHistoryDetailItemsProps>) {
  return (
    <section className="grid gap-3" aria-labelledby="movement-items-title">
      <h2 id="movement-items-title" className="m-0 text-xl font-bold">
        Ítems
      </h2>
      {items.length === 0 ? (
        <p className="m-0 rounded-2xl border border-dashed border-[#b8c7e5] bg-white p-5 text-[#667085]">
          El movimiento no contiene ítems.
        </p>
      ) : (
        items.map((item) => (
          <article
            key={item.id}
            className="grid gap-3 rounded-2xl border border-[#e1e6ef] bg-white p-4 min-[641px]:grid-cols-[minmax(0,1fr)_auto] min-[641px]:items-center"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="m-0 text-base font-bold">{item.description}</h3>
                {!item.isActive ? (
                  <span className="rounded-full bg-[#f1f3f7] px-2.5 py-1 text-xs font-bold text-[#596579]">
                    Retirado
                  </span>
                ) : null}
              </div>
              <p className="mt-1 mb-0 text-sm text-[#667085]">
                {item.categoryName || "Categoría no disponible"}
                {item.categoryIsActive === false ? " · Categoría inactiva" : ""}
                {item.productName ? ` · ${item.productName}` : ""}
                {item.productIsActive === false ? " · Producto inactivo" : ""}
              </p>
              <p className="mt-2 mb-0 text-sm text-[#46536b]">
                {item.quantity} × {formatMoney(item.unitAmount, currencyCode)}
              </p>
            </div>
            <strong>{formatMoney(item.subtotalAmount, currencyCode)}</strong>
          </article>
        ))
      )}
    </section>
  )
}

import { money } from "~/shared/utils/money"
import type { FinancialSummaryProps } from "./interfaces"
import styles from "./styles.module.css"

export function FinancialSummary({
  dashboard,
}: Readonly<FinancialSummaryProps>) {
  const metrics = [
    ["Saldo de cierre", dashboard.closingBalance, "primary"],
    ["Ingresos", dashboard.cashInflow, "positive"],
    ["Egresos", dashboard.cashOutflow, "negative"],
    [
      "Flujo neto",
      dashboard.netCashFlow,
      dashboard.netCashFlow >= 0 ? "positive" : "negative",
    ],
    ["Margen bruto estimado", dashboard.estimatedGrossMargin, "standard"],
    ["Venta promedio", dashboard.averageSaleAmount, "standard"],
  ] as const

  return (
    <section className={styles.grid} aria-label="Resumen financiero">
      {metrics.map(([label, value, tone]) => (
        <article key={label} className={`${styles.card} ${styles[tone]}`}>
          <span>{label}</span>
          <strong>{money(value, dashboard.currencyCode)}</strong>
        </article>
      ))}
    </section>
  )
}

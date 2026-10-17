import { money } from "~/shared/utils/money"
import { TONE_CLASSNAMES } from "./constants"
import type { FinancialSummaryProps } from "./interfaces"
import { buildMetrics } from "./utils"

export function FinancialSummary({
  dashboard,
}: Readonly<FinancialSummaryProps>) {
  const metrics = buildMetrics(dashboard)
  return (
    <section
      className="grid grid-cols-2 gap-[15px] min-[621px]:grid-cols-3 min-[1101px]:grid-cols-6"
      aria-label="Resumen financiero"
    >
      {metrics.map(([label, value, tone]) => (
        <article
          key={label}
          className={`grid min-w-0 gap-[9px] rounded-2xl border border-[#e2e7f0] bg-white p-[15px] min-[621px]:p-[19px] ${TONE_CLASSNAMES[tone]}`}
        >
          <span className="text-xs font-bold text-[#748096]">{label}</span>
          <strong className="overflow-hidden text-[clamp(1rem,1.8vw,1.35rem)] text-ellipsis text-[#1b2944]">
            {money(value, dashboard.currencyCode)}
          </strong>
        </article>
      ))}
    </section>
  )
}

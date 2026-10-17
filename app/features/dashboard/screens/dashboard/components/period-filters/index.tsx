import { FinancialDashboardGranularity } from "../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"
import { CLASSNAMES } from "./constants"
import type { PeriodFiltersProps } from "./interfaces"

export function PeriodFilters({
  values,
  onChange,
}: Readonly<PeriodFiltersProps>) {
  return (
    <div className="flex flex-wrap gap-3">
      <label className={CLASSNAMES.labelClassName}>
        <span className={CLASSNAMES.captionClassName}>Desde</span>
        <input
          className={CLASSNAMES.controlClassName}
          type="date"
          value={values.dateFrom}
          onChange={(event) =>
            onChange({ ...values, dateFrom: event.target.value })
          }
        />
      </label>
      <label className={CLASSNAMES.labelClassName}>
        <span className={CLASSNAMES.captionClassName}>Hasta</span>
        <input
          className={CLASSNAMES.controlClassName}
          type="date"
          value={values.dateTo}
          onChange={(event) =>
            onChange({ ...values, dateTo: event.target.value })
          }
        />
      </label>
      <label className={CLASSNAMES.labelClassName}>
        <span className={CLASSNAMES.captionClassName}>Agrupación</span>
        <select
          className={CLASSNAMES.controlClassName}
          value={values.granularity}
          onChange={(event) =>
            onChange({
              ...values,
              granularity: Number(
                event.target.value,
              ) as FinancialDashboardGranularity,
            })
          }
        >
          <option value={FinancialDashboardGranularity.Auto}>Automática</option>
          <option value={FinancialDashboardGranularity.Day}>Día</option>
          <option value={FinancialDashboardGranularity.Week}>Semana</option>
          <option value={FinancialDashboardGranularity.Month}>Mes</option>
          <option value={FinancialDashboardGranularity.Year}>Año</option>
        </select>
      </label>
    </div>
  )
}

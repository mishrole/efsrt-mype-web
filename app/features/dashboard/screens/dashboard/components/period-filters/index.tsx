import { FinancialDashboardGranularity } from "../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"
import type { PeriodFiltersProps } from "./interfaces"
import styles from "./styles.module.css"

export function PeriodFilters({
  values,
  onChange,
}: Readonly<PeriodFiltersProps>) {
  return (
    <div className={styles.filters}>
      <label>
        <span>Desde</span>
        <input
          type="date"
          value={values.dateFrom}
          onChange={(event) =>
            onChange({ ...values, dateFrom: event.target.value })
          }
        />
      </label>
      <label>
        <span>Hasta</span>
        <input
          type="date"
          value={values.dateTo}
          onChange={(event) =>
            onChange({ ...values, dateTo: event.target.value })
          }
        />
      </label>
      <label>
        <span>Agrupación</span>
        <select
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

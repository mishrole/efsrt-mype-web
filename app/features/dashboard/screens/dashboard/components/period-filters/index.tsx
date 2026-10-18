import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select"
import { FinancialDashboardGranularity } from "../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"
import { CLASSNAMES, GRANULARITY_LABELS } from "./constants"
import type { PeriodFiltersProps } from "./interfaces"

export function PeriodFilters({
  values,
  onChange,
}: Readonly<PeriodFiltersProps>) {
  function handleDateFromChange(dateFrom: string): void {
    onChange({
      ...values,
      dateFrom,
    })
  }

  function handleDateToChange(dateTo: string): void {
    onChange({
      ...values,
      dateTo,
    })
  }

  function handleGranularityChange(granularity: string | null): void {
    if (granularity === null) {
      return
    }

    onChange({
      ...values,
      granularity: Number(granularity) as FinancialDashboardGranularity,
    })
  }

  return (
    <div className="flex flex-wrap gap-3">
      <label className={CLASSNAMES.labelClassName}>
        <span className={CLASSNAMES.captionClassName}>Desde</span>
        <input
          className={CLASSNAMES.controlClassName}
          type="date"
          value={values.dateFrom}
          onChange={(event) => handleDateFromChange(event.target.value)}
        />
      </label>

      <label className={CLASSNAMES.labelClassName}>
        <span className={CLASSNAMES.captionClassName}>Hasta</span>
        <input
          className={CLASSNAMES.controlClassName}
          type="date"
          value={values.dateTo}
          onChange={(event) => handleDateToChange(event.target.value)}
        />
      </label>

      <div className={CLASSNAMES.labelClassName}>
        <span className={CLASSNAMES.captionClassName}>Agrupación</span>

        <Select
          value={String(values.granularity)}
          onValueChange={handleGranularityChange}
        >
          <SelectTrigger
            aria-label="Agrupación"
            className="min-h-10 min-w-[9.5rem] rounded-[10px] border-[#d9e0ec] bg-white px-[11px] text-[#2a3852]"
          >
            <SelectValue>{GRANULARITY_LABELS[values.granularity]}</SelectValue>
          </SelectTrigger>

          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectItem value={String(FinancialDashboardGranularity.Auto)}>
              {GRANULARITY_LABELS[FinancialDashboardGranularity.Auto]}
            </SelectItem>

            <SelectItem value={String(FinancialDashboardGranularity.Day)}>
              {GRANULARITY_LABELS[FinancialDashboardGranularity.Day]}
            </SelectItem>

            <SelectItem value={String(FinancialDashboardGranularity.Week)}>
              {GRANULARITY_LABELS[FinancialDashboardGranularity.Week]}
            </SelectItem>

            <SelectItem value={String(FinancialDashboardGranularity.Month)}>
              {GRANULARITY_LABELS[FinancialDashboardGranularity.Month]}
            </SelectItem>

            <SelectItem value={String(FinancialDashboardGranularity.Year)}>
              {GRANULARITY_LABELS[FinancialDashboardGranularity.Year]}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

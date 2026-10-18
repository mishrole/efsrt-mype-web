import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select"
import { FinancialDashboardGranularity } from "../../../../../../services/financial-dashboard/get-financial-dashboard/interfaces"
import { DateFilter } from "../date-filter"
import { GRANULARITY_LABELS, GRANULARITY_OPTIONS } from "./constants"
import type { PeriodFiltersProps, PeriodFilterValues } from "./interfaces"

export function PeriodFilters({
  values,
  onChange,
}: Readonly<PeriodFiltersProps>) {
  const [draftValues, setDraftValues] = useState<PeriodFilterValues>(values)

  useEffect(() => {
    function synchronizeDraftValues(): void {
      setDraftValues(values)
    }

    synchronizeDraftValues()
  }, [values])

  function emitCompleteFilters(nextValues: PeriodFilterValues): void {
    if (!nextValues.dateFrom || !nextValues.dateTo) {
      return
    }

    onChange(nextValues)
  }

  function handleDateFromChange(dateFrom: string): void {
    const nextValues = {
      ...draftValues,
      dateFrom,
    }

    setDraftValues(nextValues)
    emitCompleteFilters(nextValues)
  }

  function handleDateToChange(dateTo: string): void {
    const nextValues = {
      ...draftValues,
      dateTo,
    }

    setDraftValues(nextValues)
    emitCompleteFilters(nextValues)
  }

  function handleGranularityChange(granularity: string | null): void {
    if (granularity === null) {
      return
    }

    const nextValues = {
      ...draftValues,
      granularity: Number(granularity) as FinancialDashboardGranularity,
    }

    setDraftValues(nextValues)
    emitCompleteFilters(nextValues)
  }

  return (
    <div className="flex flex-wrap gap-3">
      <DateFilter
        label="Desde"
        value={draftValues.dateFrom}
        onChange={handleDateFromChange}
      />

      <DateFilter
        label="Hasta"
        value={draftValues.dateTo}
        onChange={handleDateToChange}
      />

      <div className="grid gap-[5px]">
        <span className="text-[0.68rem] font-extrabold text-[#748096] uppercase">
          Agrupación
        </span>

        <Select
          value={String(draftValues.granularity)}
          onValueChange={handleGranularityChange}
        >
          <SelectTrigger
            aria-label="Agrupación"
            className="min-h-10 min-w-[9.5rem] rounded-[10px] border-[#d9e0ec] bg-white px-[11px] text-[#2a3852]"
          >
            <SelectValue>
              {GRANULARITY_LABELS[draftValues.granularity]}
            </SelectValue>
          </SelectTrigger>

          <SelectContent align="start" alignItemWithTrigger={false}>
            {GRANULARITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

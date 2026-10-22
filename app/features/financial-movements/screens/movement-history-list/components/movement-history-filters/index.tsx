import type { FormEvent } from "react"
import { XIcon } from "lucide-react"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import type { FinancialMovementType } from "~/features/financial-movements/constants"
import { CategoryType } from "~/services/categories/interfaces"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"
import { Button } from "~/shared/components/ui/button"
import { Input } from "~/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select"
import type { MovementHistoryFiltersProps } from "./interfaces"

const ALL_FILTER_VALUE = "all"

function getTypeLabel(type: number | undefined): string {
  if (type === FINANCIAL_MOVEMENT_TYPES.sale) {
    return "Ventas"
  }

  if (type === FINANCIAL_MOVEMENT_TYPES.expense) {
    return "Gastos"
  }

  return "Todos"
}

function getStatusLabel(status: FinancialMovementStatus | undefined): string {
  switch (status) {
    case FinancialMovementStatus.Draft:
      return "Borradores"
    case FinancialMovementStatus.Confirmed:
      return "Confirmados"
    case FinancialMovementStatus.Cancelled:
      return "Anulados"
    case FinancialMovementStatus.Discarded:
      return "Descartados"
    default:
      return "Todos"
  }
}

export function MovementHistoryFilters({
  values,
  categories,
  disabled = false,
  onChange,
  onApply,
  onClear,
}: Readonly<MovementHistoryFiltersProps>) {
  function submitFilters(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onApply()
  }

  function changeType(selectedValue: string | null): void {
    onChange({
      ...values,
      type:
        selectedValue === ALL_FILTER_VALUE || selectedValue === null
          ? undefined
          : (Number(selectedValue) as FinancialMovementType),
    })
  }

  function changeStatus(selectedValue: string | null): void {
    onChange({
      ...values,
      status:
        selectedValue === ALL_FILTER_VALUE || selectedValue === null
          ? undefined
          : (Number(selectedValue) as FinancialMovementStatus),
    })
  }

  function changeCategory(selectedValue: string | null): void {
    onChange({
      ...values,
      categoryId:
        selectedValue === ALL_FILTER_VALUE || selectedValue === null
          ? ""
          : selectedValue,
    })
  }

  return (
    <form
      className="grid gap-4 rounded-2xl border border-[#e1e6ef] bg-white p-4 shadow-sm min-[641px]:p-5 min-[997px]:grid-cols-[repeat(5,minmax(0,1fr))_auto_auto] min-[997px]:items-end"
      onSubmit={submitFilters}
    >
      <div className="grid gap-1.5">
        <span className="text-xs font-bold text-[#748096] uppercase">Tipo</span>
        <Select
          value={values.type?.toString() ?? ALL_FILTER_VALUE}
          onValueChange={changeType}
          disabled={disabled}
        >
          <SelectTrigger
            aria-label="Tipo"
            className="min-h-12 w-full rounded-xl"
          >
            <SelectValue>{getTypeLabel(values.type)}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectItem value={ALL_FILTER_VALUE}>Todos</SelectItem>
            <SelectItem value={String(FINANCIAL_MOVEMENT_TYPES.sale)}>
              Ventas
            </SelectItem>
            <SelectItem value={String(FINANCIAL_MOVEMENT_TYPES.expense)}>
              Gastos
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <span className="text-xs font-bold text-[#748096] uppercase">
          Estado
        </span>
        <Select
          value={values.status?.toString() ?? ALL_FILTER_VALUE}
          onValueChange={changeStatus}
          disabled={disabled}
        >
          <SelectTrigger
            aria-label="Estado"
            className="min-h-12 w-full rounded-xl"
          >
            <SelectValue>{getStatusLabel(values.status)}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectItem value={ALL_FILTER_VALUE}>Todos</SelectItem>
            <SelectItem value={String(FinancialMovementStatus.Draft)}>
              Borradores
            </SelectItem>
            <SelectItem value={String(FinancialMovementStatus.Confirmed)}>
              Confirmados
            </SelectItem>
            <SelectItem value={String(FinancialMovementStatus.Cancelled)}>
              Anulados
            </SelectItem>
            <SelectItem value={String(FinancialMovementStatus.Discarded)}>
              Descartados
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <label className="grid gap-1.5">
        <span className="text-xs font-bold text-[#748096] uppercase">
          Desde
        </span>
        <Input
          type="date"
          aria-label="Fecha desde"
          value={values.dateFrom}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...values, dateFrom: event.currentTarget.value })
          }
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-xs font-bold text-[#748096] uppercase">
          Hasta
        </span>
        <Input
          type="date"
          aria-label="Fecha hasta"
          value={values.dateTo}
          disabled={disabled}
          onChange={(event) =>
            onChange({ ...values, dateTo: event.currentTarget.value })
          }
        />
      </label>

      <div className="grid gap-1.5">
        <span className="text-xs font-bold text-[#748096] uppercase">
          Categoría
        </span>
        <Select
          value={values.categoryId || ALL_FILTER_VALUE}
          onValueChange={changeCategory}
          disabled={disabled}
        >
          <SelectTrigger
            aria-label="Categoría"
            className="min-h-12 w-full rounded-xl"
          >
            <SelectValue>
              {categories.find((category) => category.id === values.categoryId)
                ?.name ?? "Todas"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectItem value={ALL_FILTER_VALUE}>Todas</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name} ·{" "}
                {category.type === CategoryType.Sale ? "Venta" : "Gasto"}
                {!category.isActive ? " · Inactiva" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={disabled}>
        Aplicar
      </Button>
      <Button
        type="button"
        variant="ghost"
        disabled={disabled}
        onClick={onClear}
      >
        <XIcon data-icon="inline-start" aria-hidden="true" />
        Limpiar
      </Button>
    </form>
  )
}

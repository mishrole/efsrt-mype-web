import { SearchIcon, XIcon } from "lucide-react"
import type { ChangeEvent, FormEvent } from "react"
import { PRODUCT_CATEGORY_STATUS_FILTERS } from "~/features/product-categories/constants"
import { Button } from "~/shared/components/ui/button"
import { Input } from "~/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select"
import type {
  ProductCategoryFiltersProps,
  ProductCategoryFilterValues,
} from "./interfaces"

export function ProductCategoryFilters({
  values,
  disabled = false,
  onChange,
  onApply,
  onClear,
}: Readonly<ProductCategoryFiltersProps>) {
  function handleSearchChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange({ ...values, search: event.target.value })
  }

  function handleStatusChange(status: string | null): void {
    if (status !== null) {
      onChange({
        ...values,
        status: status as ProductCategoryFilterValues["status"],
      })
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    onApply()
  }

  return (
    <form
      className="grid gap-3 rounded-2xl border border-[#e1e6ef] bg-white p-4 min-[721px]:grid-cols-[minmax(220px,1fr)_minmax(180px,auto)_minmax(150px,auto)_auto_auto] min-[721px]:items-end"
      onSubmit={handleSubmit}
    >
      <label className="grid gap-1.5">
        <span className="text-xs font-bold text-[#748096] uppercase">
          Buscar
        </span>
        <div className="relative">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8490a3]"
            aria-hidden="true"
          />
          <Input
            aria-label="Buscar categorías de producto"
            className="min-h-12 rounded-xl border-[#d9e0ec] bg-white px-3 py-3"
            value={values.search}
            onChange={handleSearchChange}
            disabled={disabled}
          />
        </div>
      </label>
      <div className="grid gap-1.5">
        <span className="text-xs font-bold text-[#748096] uppercase">
          Estado
        </span>
        <Select
          value={values.status}
          onValueChange={handleStatusChange}
          disabled={disabled}
        >
          <SelectTrigger
            aria-label="Estado"
            className="min-h-12 w-full rounded-xl border-[#d9e0ec] bg-white min-[721px]:min-w-[150px]"
          >
            <SelectValue>
              {values.status === PRODUCT_CATEGORY_STATUS_FILTERS.active
                ? "Activas"
                : values.status === PRODUCT_CATEGORY_STATUS_FILTERS.inactive
                  ? "Inactivas"
                  : "Todas"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start" alignItemWithTrigger={false}>
            <SelectItem value={PRODUCT_CATEGORY_STATUS_FILTERS.all}>
              Todas
            </SelectItem>
            <SelectItem value={PRODUCT_CATEGORY_STATUS_FILTERS.active}>
              Activas
            </SelectItem>
            <SelectItem value={PRODUCT_CATEGORY_STATUS_FILTERS.inactive}>
              Inactivas
            </SelectItem>
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

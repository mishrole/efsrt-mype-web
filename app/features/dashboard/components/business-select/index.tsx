import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/components/ui/select"
import type { BusinessSelectProps } from "./interfaces"

export function BusinessSelect({
  businesses,
  currentBusinessId,
  onChange,
}: Readonly<BusinessSelectProps>) {
  const currentBusiness = businesses.find(
    (business) => business.businessId === currentBusinessId,
  )

  function handleValueChange(businessId: string | null): void {
    if (businessId && businessId !== currentBusinessId) {
      onChange(businessId)
    }
  }

  return (
    <div className="flex items-center gap-[9px]">
      <span className="hidden text-[0.72rem] font-extrabold text-[#748096] uppercase min-[721px]:inline">
        Negocio
      </span>
      <Select value={currentBusinessId} onValueChange={handleValueChange}>
        <SelectTrigger
          aria-label="Negocio"
          className="min-h-[42px] w-[138px] rounded-[10px] border-[#d9e0ec] bg-[#f7f9fd] px-3 text-[#263653] min-[721px]:w-auto min-[721px]:min-w-[180px]"
        >
          <SelectValue>
            {currentBusiness?.displayName ?? "Seleccionar negocio"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="start" alignItemWithTrigger={false}>
          {businesses.map((business) => (
            <SelectItem key={business.businessId} value={business.businessId}>
              {business.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

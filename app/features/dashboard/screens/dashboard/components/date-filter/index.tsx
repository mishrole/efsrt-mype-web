import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "~/shared/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/shared/components/ui/popover"
import type { DateFilterProps } from "./interfaces"
import { formatDateLabel, formatDateValue, parseDateValue } from "./utils"

export function DateFilter({
  label,
  value,
  onChange,
}: Readonly<DateFilterProps>) {
  const selectedDate = parseDateValue(value)

  function handleDateChange(date: Date | undefined): void {
    if (date) {
      onChange(formatDateValue(date))
    }
  }

  return (
    <div className="grid gap-[5px]">
      <span className="text-[0.68rem] font-extrabold text-[#748096] uppercase">
        {label}
      </span>
      <Popover>
        <PopoverTrigger
          aria-label={label}
          className="flex min-h-10 min-w-[9.5rem] cursor-pointer items-center justify-between gap-2 rounded-[10px] border border-[#d9e0ec] bg-white px-[11px] text-left text-[#2a3852] outline-none focus-visible:ring-2 focus-visible:ring-[#2458d1]/35"
        >
          <span>{formatDateLabel(value)}</span>
          <CalendarIcon className="size-4 text-[#667085]" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            locale={es}
            selected={selectedDate}
            onSelect={handleDateChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

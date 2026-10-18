const DATE_PART_COUNT = 3

export function parseDateValue(value: string): Date | undefined {
  const parts = value.split("-").map(Number)

  if (parts.length !== DATE_PART_COUNT || parts.some(Number.isNaN)) {
    return undefined
  }

  const [year, month, day] = parts
  const date = new Date(year, month - 1, day)

  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : undefined
}

export function formatDateValue(date: Date): string {
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function formatDateLabel(value: string): string {
  const date = parseDateValue(value)

  if (!date) {
    return "Seleccionar fecha"
  }

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

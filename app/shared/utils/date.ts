const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
})

export function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatDateTime(value: string): string {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return DATE_TIME_FORMATTER.format(date)
}

export function getCurrentLocalDate(): string {
  const currentDate = new Date()
  const timezoneOffset = currentDate.getTimezoneOffset() * 60_000

  return new Date(currentDate.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 10)
}

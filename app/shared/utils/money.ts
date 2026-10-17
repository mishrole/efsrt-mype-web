export function money(value: number, currency: string): string {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(
    value,
  )
}

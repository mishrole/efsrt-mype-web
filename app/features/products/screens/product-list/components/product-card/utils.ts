export function formatMoney(value: number, currencyCode: string): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(value)
}

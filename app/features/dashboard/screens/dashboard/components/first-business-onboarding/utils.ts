export const buildDefaultValues = (today: string) => {
  return {
    displayName: "",
    legalName: "",
    ruc: "",
    currencyCode: "PEN",
    openingBalanceAmount: "0",
    openingBalanceDate: today,
  }
}

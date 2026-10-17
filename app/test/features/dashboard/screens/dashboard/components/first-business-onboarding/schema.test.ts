import { describe, expect, it } from "vitest"
import { firstBusinessSchema } from "../../../../../../../features/dashboard/screens/dashboard/components/first-business-onboarding/schema"

describe("firstBusinessSchema", () => {
  it("trims text, uppercases the currency and transforms the opening balance", () => {
    expect(
      firstBusinessSchema.parse({
        displayName: " Pepito Grillo ",
        legalName: " Pepito Grillo S.A.C. ",
        ruc: "20123456789",
        currencyCode: "pen",
        openingBalanceAmount: "1000.50",
        openingBalanceDate: "2026-10-16",
      }),
    ).toEqual({
      displayName: "Pepito Grillo",
      legalName: "Pepito Grillo S.A.C.",
      ruc: "20123456789",
      currencyCode: "PEN",
      openingBalanceAmount: 1000.5,
      openingBalanceDate: "2026-10-16",
    })
  })

  it("rejects an empty name, invalid RUC and empty opening balance", () => {
    const result = firstBusinessSchema.safeParse({
      displayName: " ",
      legalName: "",
      ruc: "123",
      currencyCode: "PEN",
      openingBalanceAmount: "",
      openingBalanceDate: "2026-10-16",
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.flatten().fieldErrors).toMatchObject({
        displayName: ["Ingresa el nombre de tu negocio."],
        ruc: ["El RUC debe contener 11 dígitos."],
        openingBalanceAmount: ["Ingresa el saldo de apertura."],
      })
    }
  })
})

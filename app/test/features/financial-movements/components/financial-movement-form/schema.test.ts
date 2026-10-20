import { describe, expect, it } from "vitest"
import { financialMovementFormSchema } from "~/features/financial-movements/components/financial-movement-form/schema"
import { FINANCIAL_MOVEMENT_DESCRIPTION_MAX_LENGTH } from "~/features/financial-movements/constants"

describe("financialMovementFormSchema", () => {
  it("accepts a date with an empty optional description", () => {
    expect(
      financialMovementFormSchema.safeParse({
        movementDate: "2026-10-19",
        description: "",
      }).success,
    ).toBe(true)
  })

  it("rejects a missing movement date", () => {
    const result = financialMovementFormSchema.safeParse({
      movementDate: "",
      description: "",
    })

    expect(result.success).toBe(false)
  })

  it("accepts the maximum description length", () => {
    expect(
      financialMovementFormSchema.safeParse({
        movementDate: "2026-10-19",
        description: "a".repeat(FINANCIAL_MOVEMENT_DESCRIPTION_MAX_LENGTH),
      }).success,
    ).toBe(true)
  })

  it("rejects a description longer than the maximum", () => {
    expect(
      financialMovementFormSchema.safeParse({
        movementDate: "2026-10-19",
        description: "a".repeat(FINANCIAL_MOVEMENT_DESCRIPTION_MAX_LENGTH + 1),
      }).success,
    ).toBe(false)
  })
})

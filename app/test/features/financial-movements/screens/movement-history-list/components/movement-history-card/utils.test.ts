import { describe, expect, it } from "vitest"
import {
  getMovementStatusClasses,
  getMovementStatusLabel,
  getMovementTypeLabel,
} from "~/features/financial-movements/screens/movement-history-list/components/movement-history-card/utils"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"

describe("movement history card utilities", () => {
  it.each([
    [FinancialMovementStatus.Draft, "Borrador"],
    [FinancialMovementStatus.Confirmed, "Confirmado"],
    [FinancialMovementStatus.Cancelled, "Anulado"],
    [FinancialMovementStatus.Discarded, "Descartado"],
  ])("maps status %s to its label", (status, expectedLabel) => {
    expect(getMovementStatusLabel(status)).toBe(expectedLabel)
  })

  it.each(
    Object.values(FinancialMovementStatus).filter(
      (status): status is FinancialMovementStatus => typeof status === "number",
    ),
  )("defines presentation classes for status %s", (status) => {
    expect(getMovementStatusClasses(status)).toContain("text-")
  })

  it.each([
    [1, "Venta"],
    [2, "Gasto"],
    [3, "Saldo de apertura"],
  ] as const)(
    "maps movement type %s to its label",
    (movementType, expectedLabel) => {
      expect(getMovementTypeLabel(movementType)).toBe(expectedLabel)
    },
  )
})

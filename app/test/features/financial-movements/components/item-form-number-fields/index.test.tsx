import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ItemFormNumberFields } from "~/features/financial-movements/components/item-form-number-fields"

describe("ItemFormNumberFields", () => {
  it("renders both numeric controls and their errors", () => {
    render(
      <ItemFormNumberFields
        quantityInput={<input aria-label="Cantidad control" />}
        quantityError="Cantidad inválida"
        unitAmountInput={<input aria-label="Importe control" />}
        unitAmountError="Importe inválido"
      />,
    )

    expect(screen.getByLabelText("Cantidad control")).toBeInTheDocument()
    expect(screen.getByText("Cantidad inválida")).toBeInTheDocument()
    expect(screen.getByLabelText("Importe control")).toBeInTheDocument()
    expect(screen.getByText("Importe inválido")).toBeInTheDocument()
  })
})

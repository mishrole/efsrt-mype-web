import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { FormField } from "~/features/auth/components/form-field"

describe("FormField", () => {
  it("renders the label and forwards the input properties", () => {
    render(
      <FormField
        id="email"
        label="Correo electrónico"
        name="email"
        type="email"
        placeholder="usuario@correo.com"
        autoComplete="email"
        className="custom-input"
      />,
    )

    const input = screen.getByLabelText("Correo electrónico")

    expect(input).toHaveAttribute("id", "email")
    expect(input).toHaveAttribute("name", "email")
    expect(input).toHaveAttribute("type", "email")
    expect(input).toHaveAttribute("placeholder", "usuario@correo.com")
    expect(input).toHaveAttribute("autocomplete", "email")
    expect(input).toHaveClass("custom-input")
    expect(input).toHaveAttribute("aria-invalid", "false")
    expect(input).not.toHaveAttribute("aria-describedby")
  })

  it("associates the validation error with the input", () => {
    render(
      <FormField
        id="email"
        label="Correo electrónico"
        name="email"
        error="El correo electrónico es obligatorio."
      />,
    )

    const input = screen.getByLabelText("Correo electrónico")
    const error = screen.getByText("El correo electrónico es obligatorio.")

    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("aria-describedby", "email-error")
    expect(error).toHaveAttribute("id", "email-error")
  })
})

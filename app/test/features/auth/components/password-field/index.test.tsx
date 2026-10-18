import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PasswordField } from "~/features/auth/components/password-field"

describe("PasswordField", () => {
  it("renders a hidden password and forwards the input properties", () => {
    render(
      <PasswordField
        id="password"
        label="Contraseña"
        name="password"
        placeholder="Ingresa tu contraseña"
        autoComplete="current-password"
        className="custom-password"
      />,
    )

    const input = screen.getByLabelText("Contraseña")
    const toggle = screen.getByLabelText("Mostrar contraseña")

    expect(input).toHaveAttribute("type", "password")
    expect(input).toHaveAttribute("name", "password")
    expect(input).toHaveAttribute("placeholder", "Ingresa tu contraseña")
    expect(input).toHaveAttribute("autocomplete", "current-password")
    expect(input).toHaveClass("custom-password")
    expect(input).toHaveAttribute("aria-invalid", "false")
    expect(input).not.toHaveAttribute("aria-describedby")
    expect(toggle).toHaveAttribute("aria-pressed", "false")
  })

  it("shows and hides the password", () => {
    render(<PasswordField id="password" label="Contraseña" name="password" />)

    const input = screen.getByLabelText("Contraseña")

    fireEvent.click(screen.getByLabelText("Mostrar contraseña"))

    expect(input).toHaveAttribute("type", "text")
    expect(screen.getByLabelText("Ocultar contraseña")).toHaveAttribute(
      "aria-pressed",
      "true",
    )

    fireEvent.click(screen.getByLabelText("Ocultar contraseña"))

    expect(input).toHaveAttribute("type", "password")
    expect(screen.getByLabelText("Mostrar contraseña")).toHaveAttribute(
      "aria-pressed",
      "false",
    )
  })

  it("associates the validation error with the input", () => {
    render(
      <PasswordField
        id="password"
        label="Contraseña"
        name="password"
        error="La contraseña es obligatoria."
      />,
    )

    const input = screen.getByLabelText("Contraseña")
    const error = screen.getByText("La contraseña es obligatoria.")

    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(input).toHaveAttribute("aria-describedby", "password-error")
    expect(error).toHaveAttribute("id", "password-error")
  })
})

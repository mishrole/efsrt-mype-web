import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { PasswordField } from "../../../../../features/auth/components/password-field"

describe("PasswordField", () => {
  it("shows and hides the password", () => {
    render(
      <PasswordField
        id="password"
        label="Contraseña"
        name="password"
        error="La contraseña es obligatoria."
      />,
    )

    const input = screen.getByLabelText("Contraseña")
    const toggle = screen.getByRole("button", { name: "Mostrar contraseña" })

    expect(input).toHaveAttribute("type", "password")
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(
      screen.getByText("La contraseña es obligatoria."),
    ).toBeInTheDocument()

    fireEvent.click(toggle)

    expect(input).toHaveAttribute("type", "text")
    expect(
      screen.getByRole("button", { name: "Ocultar contraseña" }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Ocultar contraseña" }))

    expect(input).toHaveAttribute("type", "password")
  })

  it("renders without an error description", () => {
    render(<PasswordField id="password" label="Contraseña" name="password" />)

    expect(screen.getByLabelText("Contraseña")).toHaveAttribute(
      "aria-invalid",
      "false",
    )
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument()
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import HomeScreen from "../../../../../features/home/screens/home"

describe("HomeScreen", () => {
  const scrollIntoView = vi.fn()

  beforeEach(() => {
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    })
  })

  afterEach(() => {
    scrollIntoView.mockClear()
  })

  it("renders the landing content and authentication actions", () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /conoce los números.*que mueven tu negocio/i,
      }),
    ).toBeInTheDocument()

    expect(
      screen.getAllByRole("link", { name: /crear cuenta/i }).length,
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByRole("link", {
        name: /iniciar sesión|ya tengo una cuenta/i,
      }).length,
    ).toBeGreaterThan(0)
    expect(
      screen.getByRole("heading", { name: /menos tiempo ordenando datos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", {
        name: /tu operación financiera lista en tres pasos/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { name: /la información correcta/i }),
    ).toBeInTheDocument()
  })

  it.each([
    ["Beneficios", "beneficios"],
    ["Cómo funciona", "como-funciona"],
    ["Seguridad", "seguridad"],
  ])(
    "scrolls to %s from the header navigation",
    (navigationLabel, sectionId) => {
      render(
        <MemoryRouter>
          <HomeScreen />
        </MemoryRouter>,
      )

      const section = document.getElementById(sectionId)
      expect(section).not.toBeNull()

      fireEvent.click(screen.getByRole("button", { name: navigationLabel }))

      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      })
    },
  )
})

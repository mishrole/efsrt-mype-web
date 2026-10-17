import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useAuthenticatedRouteRedirect } from "~/shared/hooks/use-authenticated-route-redirect"
import RegisterScreen from "../../../../../features/auth/screens/register"
import { register } from "../../../../../services/auth/register"

const navigate = vi.hoisted(() => vi.fn())

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router")

  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

vi.mock("../../../../../services/auth/register", () => ({
  register: vi.fn(),
}))

vi.mock("~/shared/hooks/use-authenticated-route-redirect", () => ({
  useAuthenticatedRouteRedirect: vi.fn(),
}))

const useAuthenticatedRouteRedirectMock = vi.mocked(
  useAuthenticatedRouteRedirect,
)

const registerMock = vi.mocked(register)

function submitRegister(): void {
  fireEvent.change(screen.getByLabelText("Nombre"), {
    target: { value: "Mitchell" },
  })
  fireEvent.change(screen.getByLabelText("Correo electrónico"), {
    target: { value: "correo@gmail.com" },
  })
  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: "password1" },
  })
  fireEvent.change(screen.getByLabelText("Confirmar contraseña"), {
    target: { value: "password1" },
  })
  fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }))
}

describe("RegisterScreen", () => {
  beforeEach(() => {
    navigate.mockReset()
    registerMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("registers the user and navigates to login", async () => {
    registerMock.mockResolvedValue({
      id: "750d0043-7495-4bdc-9215-ff9780489db9",
      displayName: "Mitchell Rodríguez",
      email: "correo@gmail.com",
    })

    render(
      <MemoryRouter>
        <RegisterScreen />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByRole("textbox", { name: /nombre/i }), {
      target: { value: "Mitchell Rodríguez" },
    })
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: " correo@gmail.com " },
    })
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "password1" },
    })
    fireEvent.change(screen.getByLabelText("Confirmar contraseña"), {
      target: { value: "password1" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }))

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        displayName: "Mitchell Rodríguez",
        email: "correo@gmail.com",
        password: "password1",
        passwordConfirmation: "password1",
      })
    })

    expect(navigate).toHaveBeenCalledWith("/login?registered=true")
  })

  it("rejects mismatched passwords without calling the service", async () => {
    render(
      <MemoryRouter>
        <RegisterScreen />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Mitchell" },
    })
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "correo@gmail.com" },
    })
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "password1" },
    })
    fireEvent.change(screen.getByLabelText("Confirmar contraseña"), {
      target: { value: "password2" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }))

    expect(
      await screen.findByText("Las contraseñas no coinciden."),
    ).toBeInTheDocument()
    expect(registerMock).not.toHaveBeenCalled()
  })

  it("maps an already registered email to the email field", async () => {
    registerMock.mockRejectedValue(
      Object.assign(new Error("Correo registrado"), {
        status: 409,
        code: "EMAIL_ALREADY_REGISTERED",
      }),
    )

    render(
      <MemoryRouter>
        <RegisterScreen />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Mitchell" },
    })
    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "correo@gmail.com" },
    })
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "password1" },
    })
    fireEvent.change(screen.getByLabelText("Confirmar contraseña"), {
      target: { value: "password1" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }))

    expect(
      await screen.findByText("Ya existe una cuenta con este correo."),
    ).toBeInTheDocument()
    expect(navigate).not.toHaveBeenCalled()
  })

  it("shows the API message for a non-conflict response", async () => {
    registerMock.mockRejectedValue(
      Object.assign(new Error("No se pudo completar el registro."), {
        status: 500,
        code: "REGISTER_FAILED",
      }),
    )

    render(
      <MemoryRouter>
        <RegisterScreen />
      </MemoryRouter>,
    )
    submitRegister()

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo completar el registro.",
    )
  })

  it("shows the connection message for an unknown error", async () => {
    registerMock.mockRejectedValue(new TypeError("Failed to fetch"))

    render(
      <MemoryRouter>
        <RegisterScreen />
      </MemoryRouter>,
    )
    submitRegister()

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No fue posible conectar con el servicio.",
    )
    expect(navigate).not.toHaveBeenCalled()
  })

  it("renders loading while an authenticated user is being redirected", () => {
    useAuthenticatedRouteRedirectMock.mockReturnValue(true)

    render(<RegisterScreen />)

    expect(screen.getByRole("status")).toHaveTextContent(
      "Cargando tu negocio...",
    )
    expect(
      screen.queryByRole("heading", { name: "Crea tu cuenta" }),
    ).not.toBeInTheDocument()
  })
})

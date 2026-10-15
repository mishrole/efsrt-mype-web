import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import LoginScreen from "../../../../../features/auth/screens/login"
import { useAuthSessionStore } from "../../../../../features/auth/stores/session"
import { login } from "../../../../../services/auth/login"

const navigate = vi.hoisted(() => vi.fn())

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router")

  return {
    ...actual,
    useNavigate: () => navigate,
  }
})

vi.mock("../../../../../services/auth/login", () => ({
  login: vi.fn(),
}))

const loginMock = vi.mocked(login)

const loginResponse = {
  accessToken: "local-access-token",
  tokenType: "Bearer",
  expiresAt: "2026-10-15T04:58:05.4315335+00:00",
  user: {
    id: "750d0043-7495-4bdc-9215-ff9780489db9",
    email: "correo@gmail.com",
    displayName: "Mitchell Rodríguez",
    status: 1,
  },
}

function submitLogin(): void {
  fireEvent.change(screen.getByLabelText("Correo electrónico"), {
    target: { value: "correo@gmail.com" },
  })
  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: "password1" },
  })
  fireEvent.click(screen.getByRole("button", { name: "Ingresar" }))
}

describe("LoginScreen", () => {
  beforeEach(() => {
    localStorage.clear()
    navigate.mockReset()
    loginMock.mockReset()
    useAuthSessionStore.getState().clearSession()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("submits credentials, stores the complete session and navigates to dashboard", async () => {
    loginMock.mockResolvedValue(loginResponse)

    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: " correo@gmail.com " },
    })
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "password1" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: "correo@gmail.com",
        password: "password1",
      })
    })

    expect(useAuthSessionStore.getState()).toMatchObject({
      accessToken: loginResponse.accessToken,
      tokenType: loginResponse.tokenType,
      expiresAt: loginResponse.expiresAt,
      user: loginResponse.user,
      isAuthenticated: true,
    })
    expect(navigate).toHaveBeenCalledWith("/dashboard")
  })

  it("shows validation errors without calling the service", async () => {
    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }))

    expect(await screen.findByText("Ingresa tu correo.")).toBeInTheDocument()
    expect(screen.getByText("Ingresa tu contraseña.")).toBeInTheDocument()
    expect(loginMock).not.toHaveBeenCalled()
  })

  it("shows a controlled message for invalid credentials", async () => {
    loginMock.mockRejectedValue(
      Object.assign(new Error("Credenciales inválidas"), {
        status: 401,
        code: "INVALID_CREDENTIALS",
      }),
    )

    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    )

    fireEvent.change(screen.getByLabelText("Correo electrónico"), {
      target: { value: "correo@gmail.com" },
    })
    fireEvent.change(screen.getByLabelText("Contraseña"), {
      target: { value: "incorrecta" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }))

    expect(
      await screen.findByRole("alert", {
        name: "",
      }),
    ).toHaveTextContent("El correo o la contraseña son incorrectos.")
    expect(navigate).not.toHaveBeenCalled()
  })

  it("shows the unavailable account message for a forbidden response", async () => {
    loginMock.mockRejectedValue(
      Object.assign(new Error("Cuenta no disponible"), {
        status: 403,
        code: "ACCOUNT_UNAVAILABLE",
      }),
    )

    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    )
    submitLogin()

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "La cuenta no está disponible.",
    )
    expect(navigate).not.toHaveBeenCalled()
  })

  it("shows the API message for another HTTP error", async () => {
    loginMock.mockRejectedValue(
      Object.assign(
        new Error("El servicio de autenticación no está disponible."),
        {
          status: 500,
          code: "LOGIN_FAILED",
        },
      ),
    )

    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    )
    submitLogin()

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El servicio de autenticación no está disponible.",
    )
  })

  it("shows the connection message for an unknown error", async () => {
    loginMock.mockRejectedValue(new TypeError("Failed to fetch"))

    render(
      <MemoryRouter>
        <LoginScreen />
      </MemoryRouter>,
    )
    submitLogin()

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No fue posible conectar con el servicio.",
    )
  })
})

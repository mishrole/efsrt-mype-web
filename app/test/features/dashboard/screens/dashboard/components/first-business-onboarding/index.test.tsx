import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { FirstBusinessOnboarding } from "../../../../../../../features/dashboard/screens/dashboard/components/first-business-onboarding"
import { createBusiness } from "../../../../../../../services/businesses/create-business"

vi.mock("../../../../../../../services/businesses/create-business", () => ({
  createBusiness: vi.fn(),
}))

vi.mock("../../../../../../../shared/utils/date", () => ({
  today: () => "2026-10-16",
}))

const createBusinessMock = vi.mocked(createBusiness)

function fillValidForm(): void {
  fireEvent.change(screen.getByLabelText("Nombre de tu negocio"), {
    target: { value: " Pepito Grillo " },
  })
  fireEvent.change(screen.getByLabelText("Razón social (opcional)"), {
    target: { value: " Pepito Grillo S.A.C. " },
  })
  fireEvent.change(screen.getByLabelText("RUC (opcional)"), {
    target: { value: "20123456789" },
  })
  fireEvent.change(screen.getByLabelText("Saldo de apertura"), {
    target: { value: "1000.50" },
  })
}

describe("FirstBusinessOnboarding", () => {
  beforeEach(() => {
    createBusinessMock.mockReset()
  })

  it("creates the first business with internal currency and opening date", async () => {
    const onCreated = vi.fn().mockResolvedValue(undefined)
    const response = {
      businessId: "business-id",
      displayName: "Pepito Grillo",
      currencyCode: "PEN",
      membershipId: "membership-id",
      roleCode: "OWNER",
      defaultCategories: [],
      openingBalanceMovementId: "movement-id",
      openingBalanceAmount: 1000.5,
      openingBalanceDate: "2026-10-16",
      version: 1,
    }

    createBusinessMock.mockResolvedValue(response)

    render(
      <FirstBusinessOnboarding
        accessToken="access-token"
        onCreated={onCreated}
      />,
    )

    fillValidForm()
    fireEvent.click(
      screen.getByRole("button", { name: "Crear negocio y continuar" }),
    )

    await waitFor(() => {
      expect(createBusinessMock).toHaveBeenCalledWith(
        {
          displayName: "Pepito Grillo",
          legalName: "Pepito Grillo S.A.C.",
          ruc: "20123456789",
          currencyCode: "PEN",
          openingBalanceAmount: 1000.5,
          openingBalanceDate: "2026-10-16",
        },
        "access-token",
      )
    })

    expect(onCreated).toHaveBeenCalledWith(response)
  })

  it("shows field errors without invoking the service", async () => {
    render(
      <FirstBusinessOnboarding
        accessToken="access-token"
        onCreated={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText("Saldo de apertura"), {
      target: { value: "" },
    })
    fireEvent.click(
      screen.getByRole("button", { name: "Crear negocio y continuar" }),
    )

    expect(
      await screen.findByText("Ingresa el nombre de tu negocio."),
    ).toBeInTheDocument()
    expect(
      screen.getByText("Ingresa el saldo de apertura."),
    ).toBeInTheDocument()
    expect(createBusinessMock).not.toHaveBeenCalled()
  })

  it("shows the API message when creation fails", async () => {
    createBusinessMock.mockRejectedValue(
      Object.assign(new Error("No se pudo crear el negocio."), {
        status: 409,
        code: "BUSINESS_ALREADY_EXISTS",
      }),
    )

    render(
      <FirstBusinessOnboarding
        accessToken="access-token"
        onCreated={vi.fn()}
      />,
    )

    fillValidForm()
    fireEvent.click(
      screen.getByRole("button", { name: "Crear negocio y continuar" }),
    )

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo crear el negocio.",
    )
  })
})

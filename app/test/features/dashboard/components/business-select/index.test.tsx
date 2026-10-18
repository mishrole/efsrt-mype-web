import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { BusinessSelect } from "~/features/dashboard/components/business-select"

const businesses = [
  {
    businessId: "business-1",
    displayName: "Negocio uno",
    currencyCode: "PEN",
    status: 1,
    membershipId: "membership-1",
    roleCode: "OWNER",
  },
  {
    businessId: "business-2",
    displayName: "Negocio dos",
    currencyCode: "PEN",
    status: 1,
    membershipId: "membership-2",
    roleCode: "OWNER",
  },
]

describe("BusinessSelect", () => {
  it("shows the current business and emits a different selection", () => {
    const onChange = vi.fn()
    render(
      <BusinessSelect
        businesses={businesses}
        currentBusinessId="business-1"
        onChange={onChange}
      />,
    )

    expect(screen.getByLabelText("Negocio")).toHaveTextContent("Negocio uno")
    fireEvent.click(screen.getByLabelText("Negocio"))
    const option = screen.getByText("Negocio dos")
    fireEvent.pointerDown(option)
    fireEvent.click(option)

    expect(onChange).toHaveBeenCalledWith("business-2")
  })
})

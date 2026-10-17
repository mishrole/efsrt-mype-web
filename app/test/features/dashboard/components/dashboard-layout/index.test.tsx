import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { DashboardLayout } from "~/features/dashboard/components/dashboard-layout"

describe("DashboardLayout", () => {
  it("renders its header and main content", () => {
    render(
      <DashboardLayout header={<header>Header</header>}>
        <section>Content</section>
      </DashboardLayout>,
    )
    expect(screen.getByText("Header")).toBeInTheDocument()
    expect(screen.getByRole("main")).toHaveTextContent("Content")
  })
})

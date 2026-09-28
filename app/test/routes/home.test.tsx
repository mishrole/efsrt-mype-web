import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import Home, { meta } from "../../routes/home"

describe("Home", () => {
  it("returns metadata and renders welcome", () => {
    expect(meta()).toEqual([
      { title: "New React Router App" },
      {
        name: "description",
        content: "Welcome to React Router!",
      },
    ])

    const result = render(<Home />)

    expect(result.getByText("React Router Docs")).toBeInTheDocument()
  })
})

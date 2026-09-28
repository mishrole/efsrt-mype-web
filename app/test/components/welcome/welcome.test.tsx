// app/components/welcome.test.tsx

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Welcome } from "~/components/welcome/welcome"

describe("Welcome", () => {
  it("renders links", () => {
    render(<Welcome />)

    expect(screen.getByText("React Router Docs")).toBeInTheDocument()
    expect(screen.getByText("Join Discord")).toBeInTheDocument()
  })
})

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { MovementHistoryPagination } from "~/features/financial-movements/screens/movement-history-list/components/movement-history-pagination"

describe("MovementHistoryPagination", () => {
  it("shows the current range and invokes available navigation", () => {
    const onPreviousPage = vi.fn()
    const onNextPage = vi.fn()
    render(
      <MovementHistoryPagination
        page={2}
        pageSize={20}
        totalCount={45}
        hasPreviousPage
        hasNextPage
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />,
    )

    expect(
      screen.getByText("Mostrando 21-40 de 45 movimientos"),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Anterior" }))
    fireEvent.click(screen.getByRole("button", { name: "Siguiente" }))
    expect(onPreviousPage).toHaveBeenCalledOnce()
    expect(onNextPage).toHaveBeenCalledOnce()
  })

  it("disables unavailable navigation and displays an empty range", () => {
    render(
      <MovementHistoryPagination
        page={1}
        pageSize={20}
        totalCount={0}
        hasPreviousPage={false}
        hasNextPage={false}
        onPreviousPage={vi.fn()}
        onNextPage={vi.fn()}
      />,
    )

    expect(
      screen.getByText("Mostrando 0-0 de 0 movimientos"),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Siguiente" })).toBeDisabled()
  })
})

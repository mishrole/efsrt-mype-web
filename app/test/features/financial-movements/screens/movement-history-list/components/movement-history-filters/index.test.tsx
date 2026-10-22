import { fireEvent, render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import { MovementHistoryFilters } from "~/features/financial-movements/screens/movement-history-list/components/movement-history-filters"
import type { MovementHistoryFilters as MovementHistoryFilterValues } from "~/features/financial-movements/screens/movement-history-list/hooks/use-movement-history/interfaces"
import { CategoryType } from "~/services/categories/interfaces"
import { FinancialMovementStatus } from "~/services/financial-movements/list-financial-movement-history/interfaces"

interface SelectMockProps {
  children: ReactNode
  disabled?: boolean
  onValueChange: (selectedValue: string | null) => void
}

interface SelectPresentationMockProps {
  children?: ReactNode
  disabled?: boolean
}

const selectValueChangeCallbacks = vi.hoisted(
  () => [] as Array<(selectedValue: string | null) => void>,
)

vi.mock("~/shared/components/ui/select", () => ({
  Select: ({ children, disabled, onValueChange }: SelectMockProps) => {
    selectValueChangeCallbacks.push(onValueChange)
    return (
      <div data-testid={disabled ? "select-disabled" : "select-enabled"}>
        {children}
      </div>
    )
  },
  SelectTrigger: ({ children }: SelectPresentationMockProps) => (
    <div>{children}</div>
  ),
  SelectValue: ({ children }: SelectPresentationMockProps) => (
    <span>{children}</span>
  ),
  SelectContent: ({ children }: SelectPresentationMockProps) => (
    <div>{children}</div>
  ),
  SelectItem: ({ children }: SelectPresentationMockProps) => (
    <span>{children}</span>
  ),
}))

const emptyFilters: MovementHistoryFilterValues = {
  type: undefined,
  status: undefined,
  dateFrom: "",
  dateTo: "",
  categoryId: "",
}

const categories = [
  {
    id: "sale-category-id",
    businessId: "business-id",
    name: "Ventas activas",
    type: CategoryType.Sale,
    isDefault: false,
    isActive: true,
  },
  {
    id: "expense-category-id",
    businessId: "business-id",
    name: "Gastos históricos",
    type: CategoryType.Expense,
    isDefault: false,
    isActive: false,
  },
]

function renderFilters(
  values: MovementHistoryFilterValues = emptyFilters,
  overrides: Partial<{
    disabled: boolean
    onChange: (nextValues: MovementHistoryFilterValues) => void
    onApply: () => void
    onClear: () => void
  }> = {},
) {
  const onChange = overrides.onChange ?? vi.fn()
  const onApply = overrides.onApply ?? vi.fn()
  const onClear = overrides.onClear ?? vi.fn()

  render(
    <MovementHistoryFilters
      values={values}
      categories={categories}
      disabled={overrides.disabled}
      onChange={onChange}
      onApply={onApply}
      onClear={onClear}
    />,
  )

  return { onChange, onApply, onClear }
}

beforeEach(() => {
  selectValueChangeCallbacks.length = 0
})

describe("MovementHistoryFilters", () => {
  it("renders every filter option including active and inactive categories", () => {
    renderFilters()

    expect(screen.getAllByText("Todos").length).toBeGreaterThanOrEqual(3)
    expect(screen.getByText("Ventas")).toBeInTheDocument()
    expect(screen.getByText("Gastos")).toBeInTheDocument()
    expect(screen.getByText("Borradores")).toBeInTheDocument()
    expect(screen.getByText("Confirmados")).toBeInTheDocument()
    expect(screen.getByText("Anulados")).toBeInTheDocument()
    expect(screen.getByText("Descartados")).toBeInTheDocument()
    expect(screen.getByText("Ventas activas · Venta")).toBeInTheDocument()
    expect(
      screen.getByText("Gastos históricos · Gasto · Inactiva"),
    ).toBeInTheDocument()
  })

  it("maps every type selection and clears type with all or null", () => {
    const { onChange } = renderFilters()
    const changeType = selectValueChangeCallbacks[0]

    changeType?.(String(FINANCIAL_MOVEMENT_TYPES.sale))
    changeType?.(String(FINANCIAL_MOVEMENT_TYPES.expense))
    changeType?.("all")
    changeType?.(null)

    expect(onChange).toHaveBeenNthCalledWith(1, {
      ...emptyFilters,
      type: FINANCIAL_MOVEMENT_TYPES.sale,
    })
    expect(onChange).toHaveBeenNthCalledWith(2, {
      ...emptyFilters,
      type: FINANCIAL_MOVEMENT_TYPES.expense,
    })
    expect(onChange).toHaveBeenNthCalledWith(3, {
      ...emptyFilters,
      type: undefined,
    })
    expect(onChange).toHaveBeenNthCalledWith(4, {
      ...emptyFilters,
      type: undefined,
    })
  })

  it("maps every status selection and clears status with all or null", () => {
    const { onChange } = renderFilters()
    const changeStatus = selectValueChangeCallbacks[1]

    changeStatus?.(String(FinancialMovementStatus.Draft))
    changeStatus?.(String(FinancialMovementStatus.Confirmed))
    changeStatus?.(String(FinancialMovementStatus.Cancelled))
    changeStatus?.(String(FinancialMovementStatus.Discarded))
    changeStatus?.("all")
    changeStatus?.(null)

    const expectedStatuses = [
      FinancialMovementStatus.Draft,
      FinancialMovementStatus.Confirmed,
      FinancialMovementStatus.Cancelled,
      FinancialMovementStatus.Discarded,
      undefined,
      undefined,
    ]

    expectedStatuses.forEach((expectedStatus, statusIndex) => {
      expect(onChange).toHaveBeenNthCalledWith(statusIndex + 1, {
        ...emptyFilters,
        status: expectedStatus,
      })
    })
  })

  it("maps category selection and clears category with all or null", () => {
    const { onChange } = renderFilters()
    const changeCategory = selectValueChangeCallbacks[2]

    changeCategory?.("expense-category-id")
    changeCategory?.("all")
    changeCategory?.(null)

    expect(onChange).toHaveBeenNthCalledWith(1, {
      ...emptyFilters,
      categoryId: "expense-category-id",
    })
    expect(onChange).toHaveBeenNthCalledWith(2, {
      ...emptyFilters,
      categoryId: "",
    })
    expect(onChange).toHaveBeenNthCalledWith(3, {
      ...emptyFilters,
      categoryId: "",
    })
  })

  it("updates both date boundaries without applying implicit defaults", () => {
    const { onChange } = renderFilters()

    fireEvent.change(screen.getByLabelText("Fecha desde"), {
      target: { value: "2026-10-01" },
    })
    fireEvent.change(screen.getByLabelText("Fecha hasta"), {
      target: { value: "2026-10-31" },
    })

    expect(onChange).toHaveBeenNthCalledWith(1, {
      ...emptyFilters,
      dateFrom: "2026-10-01",
    })
    expect(onChange).toHaveBeenNthCalledWith(2, {
      ...emptyFilters,
      dateTo: "2026-10-31",
    })
  })

  it("submits and clears using the provided callbacks", () => {
    const { onApply, onClear } = renderFilters()

    fireEvent.click(screen.getByRole("button", { name: "Aplicar" }))
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }))

    expect(onApply).toHaveBeenCalledOnce()
    expect(onClear).toHaveBeenCalledOnce()
  })

  it.each([
    [FINANCIAL_MOVEMENT_TYPES.sale, "Ventas"],
    [FINANCIAL_MOVEMENT_TYPES.expense, "Gastos"],
  ])("renders the selected type label %s", (type, expectedLabel) => {
    renderFilters({ ...emptyFilters, type })

    expect(screen.getAllByText(expectedLabel).length).toBeGreaterThanOrEqual(1)
  })

  it.each([
    [FinancialMovementStatus.Draft, "Borradores"],
    [FinancialMovementStatus.Confirmed, "Confirmados"],
    [FinancialMovementStatus.Cancelled, "Anulados"],
    [FinancialMovementStatus.Discarded, "Descartados"],
  ])("renders the selected status label %s", (status, expectedLabel) => {
    renderFilters({ ...emptyFilters, status })

    expect(screen.getAllByText(expectedLabel).length).toBeGreaterThanOrEqual(1)
  })

  it("renders the selected category label and falls back to all for an unknown category", () => {
    const { unmount } = render(
      <MovementHistoryFilters
        values={{ ...emptyFilters, categoryId: "sale-category-id" }}
        categories={categories}
        onChange={vi.fn()}
        onApply={vi.fn()}
        onClear={vi.fn()}
      />,
    )

    expect(screen.getAllByText("Ventas activas").length).toBeGreaterThanOrEqual(
      1,
    )
    unmount()
    selectValueChangeCallbacks.length = 0

    renderFilters({ ...emptyFilters, categoryId: "unknown-category-id" })
    expect(screen.getAllByText("Todas").length).toBeGreaterThanOrEqual(2)
  })

  it("disables dates and actions while the history is loading", () => {
    renderFilters(emptyFilters, { disabled: true })

    expect(screen.getByLabelText("Fecha desde")).toBeDisabled()
    expect(screen.getByLabelText("Fecha hasta")).toBeDisabled()
    expect(screen.getByRole("button", { name: "Aplicar" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Limpiar" })).toBeDisabled()
    expect(screen.getAllByTestId("select-disabled")).toHaveLength(3)
  })
})

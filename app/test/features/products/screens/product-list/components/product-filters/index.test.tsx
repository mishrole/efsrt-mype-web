import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { PRODUCT_STATUS_FILTERS } from "~/features/products/constants"
import { ProductFilters } from "~/features/products/screens/product-list/components/product-filters"
import { CategoryType } from "~/services/categories/interfaces"

const categories = [
  {
    id: "category-id",
    businessId: "business-id",
    name: "Bebidas",
    type: CategoryType.Sale,
    isDefault: false,
    isActive: true,
  },
]

const values = {
  search: "",
  categoryId: "all",
  status: PRODUCT_STATUS_FILTERS.all,
}

describe("ProductFilters", () => {
  const onChange = vi.fn()
  const onApply = vi.fn()
  const onClear = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("emits the updated search", () => {
    render(
      <ProductFilters
        categories={categories}
        values={values}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />,
    )

    fireEvent.change(screen.getByLabelText("Buscar productos"), {
      target: {
        value: "gaseosa",
      },
    })

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith({
      ...values,
      search: "gaseosa",
    })
  })

  it("emits the selected category", () => {
    render(
      <ProductFilters
        categories={categories}
        values={values}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />,
    )

    fireEvent.click(screen.getByLabelText("Categoría"))

    const categoryOption = screen.getByText("Bebidas")

    fireEvent.pointerDown(categoryOption)
    fireEvent.click(categoryOption)

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith({
      ...values,
      categoryId: "category-id",
    })
  })

  it("emits the selected status", () => {
    render(
      <ProductFilters
        categories={categories}
        values={values}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />,
    )

    fireEvent.click(screen.getByLabelText("Estado"))

    const inactiveOption = screen.getByText("Inactivos")

    fireEvent.pointerDown(inactiveOption)
    fireEvent.click(inactiveOption)

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith({
      ...values,
      status: PRODUCT_STATUS_FILTERS.inactive,
    })
  })

  it("applies the current filters", () => {
    render(
      <ProductFilters
        categories={categories}
        values={values}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />,
    )

    fireEvent.click(
      screen.getByRole("button", {
        name: "Aplicar",
      }),
    )

    expect(onApply).toHaveBeenCalledOnce()
  })

  it("clears the current filters", () => {
    render(
      <ProductFilters
        categories={categories}
        values={values}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />,
    )

    fireEvent.click(
      screen.getByRole("button", {
        name: "Limpiar",
      }),
    )

    expect(onClear).toHaveBeenCalledOnce()
  })

  it("disables every control while loading", () => {
    render(
      <ProductFilters
        categories={categories}
        values={values}
        disabled
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />,
    )

    expect(screen.getByLabelText("Buscar productos")).toBeDisabled()

    expect(screen.getByLabelText("Categoría")).toBeDisabled()

    expect(screen.getByLabelText("Estado")).toBeDisabled()

    expect(
      screen.getByRole("button", {
        name: "Aplicar",
      }),
    ).toBeDisabled()

    expect(
      screen.getByRole("button", {
        name: "Limpiar",
      }),
    ).toBeDisabled()
  })
})

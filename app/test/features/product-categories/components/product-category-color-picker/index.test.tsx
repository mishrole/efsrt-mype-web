import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProductCategoryColorPicker } from "~/features/product-categories/components/product-category-color-picker"
describe("ProductCategoryColorPicker", () => {
  it("selects predefined and custom colors", () => {
    const onChange = vi.fn()
    render(<ProductCategoryColorPicker value="#64748B" onChange={onChange} />)
    fireEvent.click(screen.getByLabelText("Seleccionar color #3F6FC4"))
    expect(onChange).toHaveBeenCalledWith("#3F6FC4")
    fireEvent.change(screen.getByLabelText("Color personalizado"), {
      target: { value: "#6751c3" },
    })
    expect(onChange).toHaveBeenCalledWith("#6751C3")
  })
})

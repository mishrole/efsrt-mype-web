import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { ProductCategoryForm } from "~/features/product-categories/components/product-category-form"
import { productCategoryFormSchema } from "~/features/product-categories/components/product-category-form/schema"

vi.mock(
  "~/features/product-categories/components/product-category-color-picker",
  () => ({
    ProductCategoryColorPicker: ({
      value,
      onChange,
      disabled,
    }: {
      value: string
      onChange: (color: string) => void
      disabled: boolean
    }) => (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange("#3F6FC4")}
      >
        Color {value}
      </button>
    ),
  }),
)

describe("ProductCategoryForm", () => {
  it("submits defaults changed by the user", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(
      <ProductCategoryForm
        isSubmitting={false}
        submitLabel="Crear categoría"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    )
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Bebidas" },
    })
    fireEvent.click(screen.getByRole("button", { name: /Color/ }))
    fireEvent.click(screen.getByRole("button", { name: "Crear categoría" }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    expect(onSubmit.mock.calls[0]?.[0]).toEqual({
      name: "Bebidas",
      color: "#3F6FC4",
    })
  })

  it("uses provided values, cancels and disables actions", () => {
    const onCancel = vi.fn()
    render(
      <ProductCategoryForm
        defaultValues={{ name: "Postres", color: "#6751C3" }}
        isSubmitting
        submitLabel="Guardar cambios"
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    )
    expect(screen.getByLabelText("Nombre")).toHaveValue("Postres")
    expect(screen.getByRole("button", { name: /Color #6751C3/ })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
  })

  it("validates name and color", () => {
    expect(
      productCategoryFormSchema.safeParse({ name: "", color: "invalid" })
        .success,
    ).toBe(false)
    expect(
      productCategoryFormSchema.safeParse({
        name: "a".repeat(121),
        color: "#3F6FC4",
      }).success,
    ).toBe(false)
    expect(
      productCategoryFormSchema.safeParse({
        name: " Bebidas ",
        color: "#3F6FC4",
      }).success,
    ).toBe(true)
  })
})

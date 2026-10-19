import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ProductCreateScreen, {
  meta,
} from "~/features/products/screens/product-create"
import { useProductCreate } from "~/features/products/screens/product-create/hooks/use-product-create"
import type { UseProductCreateResult } from "~/features/products/screens/product-create/hooks/use-product-create/interfaces"

vi.mock(
  "~/features/products/screens/product-create/hooks/use-product-create",
  () => ({
    useProductCreate: vi.fn(),
  }),
)

const useProductCreateMock = vi.mocked(useProductCreate)
const defaultState: UseProductCreateResult = {
  productCategories: [],
  isLoading: false,
  isSubmitting: false,
  error: "",
  canSubmit: false,
  submitProduct: vi.fn(),
  returnToProducts: vi.fn(),
}

describe("ProductCreateScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProductCreateMock.mockReturnValue(defaultState)
  })

  it("returns page metadata", () => {
    expect(meta()).toEqual([{ title: "Nuevo producto | Mype" }])
  })

  it("renders loading and error states", () => {
    useProductCreateMock.mockReturnValue({
      ...defaultState,
      isLoading: true,
      error: "No fue posible cargar las categorías necesarias.",
    })

    render(<ProductCreateScreen />)

    expect(screen.getByText("Cargando categorías...")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent(
      "No fue posible cargar las categorías necesarias.",
    )
  })

  it("renders the form and returns to products", () => {
    const returnToProducts = vi.fn()
    useProductCreateMock.mockReturnValue({
      ...defaultState,
      canSubmit: true,
      returnToProducts,
      productCategories: [
        {
          id: "product-category-id",
          businessId: "business-id",
          name: "Bebidas",
          color: "#3F6FC4",
          isDefault: false,
          isActive: true,
          deactivatedAt: null,
          createdAt: "2026-10-18T05:00:00Z",
          updatedAt: "2026-10-18T05:00:00Z",
          version: 1,
        },
      ],
    })

    render(<ProductCreateScreen />)

    expect(
      screen.getByRole("button", { name: "Crear producto" }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Volver a productos" }))
    expect(returnToProducts).toHaveBeenCalledOnce()
  })
})

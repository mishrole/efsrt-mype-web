import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ProductCreateScreen, {
  meta,
} from "~/features/products/screens/product-create"
import { useProductCreate } from "~/features/products/screens/product-create/hooks/use-product-create"

const cancel = vi.fn()
const useProductCreateMock = vi.mocked(useProductCreate)

vi.mock(
  "~/features/products/screens/product-create/hooks/use-product-create",
  () => ({ useProductCreate: vi.fn() }),
)

const defaultState = {
  categories: [],
  isLoading: false,
  isSubmitting: false,
  error: "",
  submitProduct: vi.fn(),
  cancel,
}

describe("ProductCreateScreen", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useProductCreateMock.mockReturnValue(defaultState)
  })

  it("defines metadata and renders the form", () => {
    expect(meta()).toEqual([{ title: "Nuevo producto | Mype" }])
    render(<ProductCreateScreen />)
    expect(
      screen.getByRole("heading", { name: "Nuevo producto" }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByText("Volver a productos"))
    expect(cancel).toHaveBeenCalledOnce()
  })

  it("renders loading and error states", () => {
    useProductCreateMock.mockReturnValue({
      ...defaultState,
      isLoading: true,
      error: "Error de categorías",
    })
    render(<ProductCreateScreen />)
    expect(screen.getByText("Cargando categorías...")).toBeInTheDocument()
    expect(screen.getByRole("alert")).toHaveTextContent("Error de categorías")
  })
})

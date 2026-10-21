import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { MovementItemsPanel } from "~/features/financial-movements/screens/movement-draft-detail/components/movement-items-panel"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"

const mocks = vi.hoisted(() => ({
  listItems: vi.fn(),
  listProducts: vi.fn(),
  listCategories: vi.fn(),
  addSale: vi.fn(),
  updateSale: vi.fn(),
  addExpense: vi.fn(),
  updateExpense: vi.fn(),
  retire: vi.fn(),
}))

vi.mock("~/features/auth/stores/session", () => ({
  useAuthSessionStore: (
    selector: (state: { accessToken: string }) => unknown,
  ) => selector({ accessToken: "access-token" }),
}))
vi.mock("~/services/financial-movements/list-financial-movement-items", () => ({
  listFinancialMovementItems: mocks.listItems,
}))
vi.mock("~/services/products/list-products", () => ({
  listProducts: mocks.listProducts,
}))
vi.mock("~/services/categories/list-categories", () => ({
  listCategories: mocks.listCategories,
}))
vi.mock("~/services/financial-movements/add-sale-item", () => ({
  addSaleItem: mocks.addSale,
}))
vi.mock("~/services/financial-movements/update-sale-item", () => ({
  updateSaleItem: mocks.updateSale,
}))
vi.mock("~/services/financial-movements/add-expense-item", () => ({
  addExpenseItem: mocks.addExpense,
}))
vi.mock("~/services/financial-movements/update-expense-item", () => ({
  updateExpenseItem: mocks.updateExpense,
}))
vi.mock(
  "~/services/financial-movements/retire-financial-movement-item",
  () => ({ retireFinancialMovementItem: mocks.retire }),
)
vi.mock(
  "~/features/financial-movements/components/financial-movement-item-modal",
  () => ({
    FinancialMovementItemModal: ({
      isOpen,
      item,
      onClose,
      onSubmitSale,
      onSubmitExpense,
    }: {
      isOpen: boolean
      item: { id: string } | null
      onClose: () => void
      onSubmitSale: (values: {
        productId: string
        quantity: number
        unitAmount: number
      }) => Promise<void>
      onSubmitExpense: (values: {
        categoryId: string
        description: string
        quantity: number
        unitAmount: number
      }) => Promise<void>
    }) =>
      isOpen ? (
        <div role="dialog">
          <span>{item ? "editing" : "creating"}</span>
          <button
            onClick={() =>
              void onSubmitSale({
                productId: "product-id",
                quantity: 2,
                unitAmount: 5,
              })
            }
          >
            save sale
          </button>
          <button
            onClick={() =>
              void onSubmitExpense({
                categoryId: "category-id",
                description: "  Taxi  ",
                quantity: 1,
                unitAmount: 20,
              })
            }
          >
            save expense
          </button>
          <button onClick={onClose}>close modal</button>
        </div>
      ) : null,
  }),
)

const saleItem = {
  id: "item-id",
  categoryId: "category-id",
  categoryName: "Ventas",
  productId: "product-id",
  productCategoryId: "group-id",
  productName: "Gaseosa",
  description: null,
  quantity: 2,
  unitAmount: 5,
  unitCostSnapshot: 3,
  subtotalAmount: 10,
  estimatedCost: 6,
  estimatedMargin: 4,
  version: 2,
}
const commonProps = {
  businessId: "business-id",
  movementId: "movement-id",
  movementVersion: 7,
  currencyCode: "PEN",
  onMovementChanged: vi.fn(),
}

describe("MovementItemsPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.listItems.mockResolvedValue({
      movementId: "movement-id",
      movementType: 1,
      movementVersion: 7,
      items: [saleItem],
    })
    mocks.listProducts.mockResolvedValue([])
    mocks.listCategories.mockResolvedValue([])
    mocks.addSale.mockResolvedValue({
      item: { ...saleItem, id: "new-item" },
      movementTotal: 20,
      movementVersion: 8,
    })
    mocks.updateSale.mockResolvedValue({
      item: { ...saleItem, quantity: 3 },
      movementTotal: 15,
      movementVersion: 8,
    })
    mocks.addExpense.mockResolvedValue({
      item: {
        ...saleItem,
        id: "expense-item",
        productId: null,
        productName: null,
        description: "Taxi",
      },
      movementTotal: 20,
      movementVersion: 8,
    })
    mocks.retire.mockResolvedValue({
      itemId: "item-id",
      movementTotal: 0,
      movementVersion: 8,
    })
  })

  it("loads active items and synchronizes total and version", async () => {
    render(
      <MovementItemsPanel
        {...commonProps}
        movementType={FINANCIAL_MOVEMENT_TYPES.sale}
      />,
    )
    expect(await screen.findByText("Gaseosa")).toBeInTheDocument()
    expect(mocks.listItems).toHaveBeenCalledWith(
      "business-id",
      "movement-id",
      "access-token",
      expect.any(AbortSignal),
    )
    expect(commonProps.onMovementChanged).toHaveBeenCalledWith(10, 7)
  })

  it("creates, edits and retires sale items with current versions", async () => {
    render(
      <MovementItemsPanel
        {...commonProps}
        movementType={FINANCIAL_MOVEMENT_TYPES.sale}
      />,
    )
    await screen.findByText("Gaseosa")
    fireEvent.click(screen.getByRole("button", { name: /Agregar producto/ }))
    await waitFor(() => expect(mocks.listProducts).toHaveBeenCalled())
    fireEvent.click(screen.getByRole("button", { name: "save sale" }))
    await waitFor(() =>
      expect(mocks.addSale).toHaveBeenCalledWith(
        "business-id",
        "movement-id",
        {
          productId: "product-id",
          quantity: 2,
          unitAmount: 5,
          movementVersion: 7,
        },
        "access-token",
      ),
    )
    fireEvent.click(screen.getAllByRole("button", { name: /Editar/ })[0])
    fireEvent.click(screen.getByRole("button", { name: "save sale" }))
    await waitFor(() =>
      expect(mocks.updateSale).toHaveBeenCalledWith(
        "business-id",
        "movement-id",
        "item-id",
        {
          productId: "product-id",
          quantity: 2,
          unitAmount: 5,
          movementVersion: 7,
          itemVersion: 2,
        },
        "access-token",
      ),
    )
    fireEvent.click(screen.getAllByRole("button", { name: /Retirar/ })[0])
    await waitFor(() =>
      expect(mocks.retire).toHaveBeenCalledWith(
        "business-id",
        "movement-id",
        "item-id",
        { movementVersion: 7, itemVersion: 2 },
        "access-token",
      ),
    )
  })

  it("shows the empty expense state and trims a new description", async () => {
    mocks.listItems.mockResolvedValue({
      movementId: "movement-id",
      movementType: 2,
      movementVersion: 7,
      items: [],
    })
    render(
      <MovementItemsPanel
        {...commonProps}
        movementType={FINANCIAL_MOVEMENT_TYPES.expense}
      />,
    )
    expect(
      await screen.findByText("Aún no hay ítems activos."),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: /Agregar concepto/ }))
    await waitFor(() => expect(mocks.listCategories).toHaveBeenCalled())
    fireEvent.click(screen.getByRole("button", { name: "save expense" }))
    await waitFor(() =>
      expect(mocks.addExpense).toHaveBeenCalledWith(
        "business-id",
        "movement-id",
        {
          categoryId: "category-id",
          description: "Taxi",
          quantity: 1,
          unitAmount: 20,
          movementVersion: 7,
        },
        "access-token",
      ),
    )
  })

  it("shows a fallback error when loading items fails", async () => {
    mocks.listItems.mockRejectedValue(new Error("network"))
    render(
      <MovementItemsPanel
        {...commonProps}
        movementType={FINANCIAL_MOVEMENT_TYPES.sale}
      />,
    )
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No fue posible cargar los ítems.",
    )
  })
})

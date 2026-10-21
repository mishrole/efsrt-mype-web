import { PlusIcon } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuthSessionStore } from "~/features/auth/stores/session"
import { FinancialMovementItemCard } from "~/features/financial-movements/components/financial-movement-item-card"
import { FinancialMovementItemModal } from "~/features/financial-movements/components/financial-movement-item-modal"
import { FINANCIAL_MOVEMENT_TYPES } from "~/features/financial-movements/constants"
import { listCategories } from "~/services/categories/list-categories"
import type { CategoryListItemResponse } from "~/services/categories/list-categories/interfaces"
import { addExpenseItem } from "~/services/financial-movements/add-expense-item"
import { addSaleItem } from "~/services/financial-movements/add-sale-item"
import type { FinancialMovementItemResponse } from "~/services/financial-movements/interfaces"
import { listFinancialMovementItems } from "~/services/financial-movements/list-financial-movement-items"
import { retireFinancialMovementItem } from "~/services/financial-movements/retire-financial-movement-item"
import { updateExpenseItem } from "~/services/financial-movements/update-expense-item"
import { updateSaleItem } from "~/services/financial-movements/update-sale-item"
import { listProducts } from "~/services/products/list-products"
import type { ProductListItemResponse } from "~/services/products/list-products/interfaces"
import { Button } from "~/shared/components/ui/button"
import { isApiError } from "~/shared/http/errors"
import type { MovementItemsPanelProps } from "./interfaces"

export function MovementItemsPanel({
  businessId,
  movementId,
  movementType,
  movementVersion,
  currencyCode,
  onMovementChanged,
  onItemsChanged,
  showHeading = true,
}: Readonly<MovementItemsPanelProps>) {
  const accessToken = useAuthSessionStore((state) => state.accessToken)
  const [items, setItems] = useState<FinancialMovementItemResponse[]>([])
  const [products, setProducts] = useState<ProductListItemResponse[]>([])
  const [categories, setCategories] = useState<CategoryListItemResponse[]>([])
  const [selectedItem, setSelectedItem] =
    useState<FinancialMovementItemResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState("")

  const itemVersions = useMemo(
    () =>
      items.map((item) => ({
        itemId: item.id,
        version: item.version,
      })),
    [items],
  )

  const isSale = movementType === FINANCIAL_MOVEMENT_TYPES.sale

  useEffect(() => {
    onItemsChanged(itemVersions)
  }, [itemVersions, onItemsChanged])

  const loadItems = useCallback(
    async (signal?: AbortSignal): Promise<void> => {
      if (!accessToken) {
        return
      }

      const response = await listFinancialMovementItems(
        businessId,
        movementId,
        accessToken,
        signal,
      )

      if (!signal?.aborted) {
        setItems(response.items)

        onMovementChanged(
          response.items.reduce(
            (movementTotal, item) => movementTotal + item.subtotalAmount,
            0,
          ),
          response.movementVersion,
        )
      }
    },
    [accessToken, businessId, movementId, onMovementChanged],
  )

  useEffect(() => {
    const controller = new AbortController()

    async function initializeItems(): Promise<void> {
      try {
        await loadItems(controller.signal)
      } catch (exception) {
        if (!controller.signal.aborted) {
          setError(
            isApiError(exception)
              ? exception.message
              : "No fue posible cargar los ítems.",
          )
        }
      }
    }

    void initializeItems()

    return () => controller.abort()
  }, [loadItems])

  const loadCreateOptions = useCallback(async (): Promise<void> => {
    if (!accessToken) {
      return
    }

    if (isSale) {
      const availableProducts = await listProducts(
        {
          businessId,
          isActive: true,
          availableForSale: true,
        },
        accessToken,
      )
      setProducts(availableProducts)
      return
    }

    const activeExpenseCategories = await listCategories(
      {
        businessId,
        type: 2,
        isActive: true,
      },
      accessToken,
    )
    setCategories(activeExpenseCategories)
  }, [accessToken, businessId, isSale])

  const loadEditOptions = useCallback(async (): Promise<void> => {
    if (!accessToken) {
      return
    }

    if (isSale) {
      const editableProducts = await listProducts(
        {
          businessId,
        },
        accessToken,
      )
      setProducts(editableProducts)
      return
    }

    const editableExpenseCategories = await listCategories(
      {
        businessId,
        type: 2,
      },
      accessToken,
    )
    setCategories(editableExpenseCategories)
  }, [accessToken, businessId, isSale])

  async function openCreateModal(): Promise<void> {
    if (!accessToken) {
      return
    }

    setSelectedItem(null)
    setError("")
    await loadCreateOptions()
    setIsModalOpen(true)
  }

  async function openEditModal(
    item: FinancialMovementItemResponse,
  ): Promise<void> {
    if (!accessToken) {
      return
    }

    setSelectedItem(item)
    setError("")
    await loadEditOptions()
    setIsModalOpen(true)
  }

  function closeModal(): void {
    if (!isBusy) {
      setIsModalOpen(false)
      setSelectedItem(null)
    }
  }

  function upsertItem(item: FinancialMovementItemResponse): void {
    setItems((currentItems) => {
      const itemExists = currentItems.some(
        (currentItem) => currentItem.id === item.id,
      )

      if (itemExists) {
        return currentItems.map((currentItem) =>
          currentItem.id === item.id ? item : currentItem,
        )
      }

      return [...currentItems, item]
    })
  }

  async function submitSale(values: {
    productId: string
    quantity: number
    unitAmount: number
  }): Promise<void> {
    if (!accessToken || isBusy) {
      return
    }

    setIsBusy(true)

    try {
      const response = selectedItem
        ? await updateSaleItem(
            businessId,
            movementId,
            selectedItem.id,
            {
              ...values,
              movementVersion,
              itemVersion: selectedItem.version,
            },
            accessToken,
          )
        : await addSaleItem(
            businessId,
            movementId,
            {
              ...values,
              movementVersion,
            },
            accessToken,
          )

      upsertItem(response.item)
      onMovementChanged(response.movementTotal, response.movementVersion)
    } finally {
      setIsBusy(false)
      setIsModalOpen(false)
      setSelectedItem(null)
    }
  }

  async function submitExpense(values: {
    categoryId: string
    description: string
    quantity: number
    unitAmount: number
  }): Promise<void> {
    if (!accessToken || isBusy) {
      return
    }

    setIsBusy(true)

    try {
      const payload = {
        ...values,
        description: values.description.trim(),
        movementVersion,
      }

      const response = selectedItem
        ? await updateExpenseItem(
            businessId,
            movementId,
            selectedItem.id,
            {
              ...payload,
              itemVersion: selectedItem.version,
            },
            accessToken,
          )
        : await addExpenseItem(businessId, movementId, payload, accessToken)

      upsertItem(response.item)
      onMovementChanged(response.movementTotal, response.movementVersion)
    } finally {
      setIsBusy(false)
      setIsModalOpen(false)
      setSelectedItem(null)
    }
  }

  async function retireItem(
    item: FinancialMovementItemResponse,
  ): Promise<void> {
    if (!accessToken || isBusy) {
      return
    }

    setIsBusy(true)

    try {
      const response = await retireFinancialMovementItem(
        businessId,
        movementId,
        item.id,
        {
          movementVersion,
          itemVersion: item.version,
        },
        accessToken,
      )

      setItems((currentItems) =>
        currentItems.filter(
          (currentItem) => currentItem.id !== response.itemId,
        ),
      )

      onMovementChanged(response.movementTotal, response.movementVersion)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <section className="grid gap-4">
      <header className="flex items-center justify-between gap-4">
        {showHeading ? (
          <div>
            <h2 className="m-0 text-xl font-bold">
              {isSale ? "Productos" : "Conceptos"}
            </h2>

            <p className="m-0 text-sm text-muted-foreground">
              Ítems activos del borrador
            </p>
          </div>
        ) : (
          <div />
        )}

        <Button type="button" onClick={() => void openCreateModal()}>
          <PlusIcon aria-hidden="true" />
          {isSale ? "Agregar producto" : "Agregar concepto"}
        </Button>
      </header>

      {error ? <div role="alert">{error}</div> : null}

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed p-6 text-center text-muted-foreground">
          Aún no hay ítems activos.
        </p>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <FinancialMovementItemCard
              key={item.id}
              item={item}
              currencyCode={currencyCode}
              isSale={isSale}
              isBusy={isBusy}
              onEdit={(currentItem) => void openEditModal(currentItem)}
              onRetire={(currentItem) => void retireItem(currentItem)}
            />
          ))}
        </div>
      )}

      <FinancialMovementItemModal
        isOpen={isModalOpen}
        movementType={movementType}
        item={selectedItem}
        products={products}
        categories={categories}
        isSubmitting={isBusy}
        onClose={closeModal}
        onSubmitSale={submitSale}
        onSubmitExpense={submitExpense}
      />
    </section>
  )
}

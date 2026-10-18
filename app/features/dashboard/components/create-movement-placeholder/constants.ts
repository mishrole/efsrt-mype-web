import type { NewItemType } from "../dashboard-header/constants"

export const PLACEHOLDER_CONTENT: Record<
  NewItemType,
  { title: string; description: string; message: string }
> = {
  sale: {
    title: "Registrar venta",
    description: "El flujo de ventas se conectará en el módulo de movimientos.",
    message: "Aquí se registrará una nueva venta.",
  },
  expense: {
    title: "Registrar gasto",
    description: "El flujo de gastos se conectará en el módulo de movimientos.",
    message: "Aquí se registrará un nuevo gasto.",
  },
  product: {
    title: "Crear producto",
    description: "La creación se conectará con el módulo de productos.",
    message: "Aquí se registrará un nuevo producto.",
  },
}

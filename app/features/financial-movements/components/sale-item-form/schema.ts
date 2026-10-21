import { z } from "zod"
export const saleItemFormSchema = z.object({
  productId: z.string().min(1, "El producto es obligatorio."),
  quantity: z
    .number({ error: "La cantidad es obligatoria." })
    .positive("La cantidad debe ser mayor que cero."),
  unitAmount: z
    .number({ error: "El importe unitario es obligatorio." })
    .min(0, "El importe no puede ser negativo."),
})
export type SaleItemFormValues = z.infer<typeof saleItemFormSchema>

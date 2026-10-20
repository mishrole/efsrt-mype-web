import { z } from "zod"
export const expenseItemFormSchema = z.object({
  categoryId: z.string().min(1, "La categoría es obligatoria."),
  description: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria.")
    .max(500, "La descripción no puede superar 500 caracteres."),
  quantity: z
    .number({ error: "La cantidad es obligatoria." })
    .positive("La cantidad debe ser mayor que cero."),
  unitAmount: z
    .number({ error: "El importe unitario es obligatorio." })
    .min(0, "El importe no puede ser negativo."),
})
export type ExpenseItemFormValues = z.infer<typeof expenseItemFormSchema>

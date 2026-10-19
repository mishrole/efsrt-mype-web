import { z } from "zod"

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(160, "El nombre no puede superar los 160 caracteres."),
  categoryId: z.string().min(1, "La categoría es obligatoria."),
  salePrice: z
    .number({ error: "El precio de venta es obligatorio." })
    .min(0, "El precio de venta no puede ser negativo."),
  unitCost: z
    .number({ error: "El coste unitario es obligatorio." })
    .min(0, "El coste unitario no puede ser negativo."),
})

import { z } from "zod"

function hasMaximumTwoDecimals(amount: number): boolean {
  return Number.isInteger(amount * 100)
}

export const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(160, "El nombre no puede superar los 160 caracteres."),
  productCategoryId: z
    .string()
    .min(1, "La categoría de producto es obligatoria."),
  salePrice: z
    .number({ error: "El precio de venta es obligatorio." })
    .min(0, "El precio de venta no puede ser negativo.")
    .refine(
      hasMaximumTwoDecimals,
      "El precio de venta admite máximo dos decimales.",
    ),
  unitCost: z
    .number({ error: "El coste unitario es obligatorio." })
    .min(0, "El coste unitario no puede ser negativo.")
    .refine(
      hasMaximumTwoDecimals,
      "El coste unitario admite máximo dos decimales.",
    ),
})

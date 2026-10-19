import { z } from "zod"
export const productCategoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(120, "El nombre no puede superar los 120 caracteres."),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Selecciona un color válido."),
})
export type ProductCategoryFormValues = z.infer<
  typeof productCategoryFormSchema
>

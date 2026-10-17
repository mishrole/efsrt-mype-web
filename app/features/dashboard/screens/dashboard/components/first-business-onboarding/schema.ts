import { z } from "zod"

export const firstBusinessSchema = z.object({
  displayName: z.string().trim().min(1, "Ingresa el nombre de tu negocio."),

  legalName: z.string().trim(),

  ruc: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d{11}$/.test(value),
      "El RUC debe contener 11 dígitos.",
    ),

  currencyCode: z
    .string()
    .trim()
    .length(3, "La moneda debe tener 3 caracteres.")
    .transform((value) => value.toUpperCase()),

  openingBalanceAmount: z
    .string()
    .trim()
    .min(1, "Ingresa el saldo de apertura.")
    .refine(
      (value) => Number.isFinite(Number(value)),
      "Ingresa un saldo válido.",
    )
    .transform(Number),

  openingBalanceDate: z.string().min(1, "Selecciona la fecha."),
})

export type FirstBusinessFormInput = z.input<typeof firstBusinessSchema>

export type FirstBusinessFormValues = z.output<typeof firstBusinessSchema>

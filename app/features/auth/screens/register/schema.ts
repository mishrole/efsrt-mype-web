import { z } from "zod"

export const registerSchema = z
  .object({
    displayName: z.string().trim().min(1, "Ingresa tu nombre."),
    email: z
      .string()
      .trim()
      .min(1, "Ingresa tu correo.")
      .email("Ingresa un correo válido."),
    password: z
      .string()
      .min(8, "Usa al menos 8 caracteres.")
      .regex(/[A-Za-z]/, "Incluye al menos una letra.")
      .regex(/\d/, "Incluye al menos un número."),
    passwordConfirmation: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Las contraseñas no coinciden.",
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

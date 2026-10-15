import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { register } from "../../../../../../services/auth/register"
import { isApiError } from "../../../../../../shared/http/errors"
import { registerSchema, type RegisterFormValues } from "../../schema"
import type { UseRegisterResult } from "./interfaces"

export function useRegister(): UseRegisterResult {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState("")
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  })

  async function submit(values: RegisterFormValues): Promise<void> {
    setSubmitError("")

    try {
      await register(values)
      await navigate("/login?registered=true")
    } catch (error) {
      if (isApiError(error) && error.status === 409) {
        form.setError(
          "email",
          { message: "Ya existe una cuenta con este correo." },
          { shouldFocus: true },
        )
        return
      }

      setSubmitError(
        isApiError(error)
          ? error.message
          : "No fue posible conectar con el servicio.",
      )
    }
  }

  return {
    form,
    submitError,
    isSubmitting: form.formState.isSubmitting,
    submit,
  }
}

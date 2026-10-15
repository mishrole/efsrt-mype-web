import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"

import { login } from "../../../../../../services/auth/login"
import { isApiError } from "../../../../../../shared/http/errors"
import { useAuthSessionStore } from "../../../../stores/session"
import { loginSchema, type LoginFormValues } from "../../schema"
import type { UseLoginResult } from "./interfaces"

export function useLogin(): UseLoginResult {
  const navigate = useNavigate()

  const setSession = useAuthSessionStore((state) => state.setSession)

  const [submitError, setSubmitError] = useState("")

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function submit(values: LoginFormValues): Promise<void> {
    setSubmitError("")

    try {
      const response = await login(values)

      setSession({
        accessToken: response.accessToken,
        tokenType: response.tokenType,
        expiresAt: response.expiresAt,
        user: response.user,
      })

      await navigate("/dashboard")
    } catch (error) {
      if (isApiError(error) && error.status === 401) {
        setSubmitError("El correo o la contraseña son incorrectos.")

        return
      }

      if (isApiError(error) && error.status === 403) {
        setSubmitError("La cuenta no está disponible.")

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

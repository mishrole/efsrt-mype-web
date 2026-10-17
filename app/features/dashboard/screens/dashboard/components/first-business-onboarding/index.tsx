import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { today } from "~/shared/utils/date"
import { createBusiness } from "../../../../../../services/businesses/create-business"
import { isApiError } from "../../../../../../shared/http/errors"
import type { FirstBusinessOnboardingProps } from "./interfaces"
import {
  firstBusinessSchema,
  type FirstBusinessFormInput,
  type FirstBusinessFormValues,
} from "./schema"
import styles from "./styles.module.css"

export function FirstBusinessOnboarding({
  accessToken,
  onCreated,
}: Readonly<FirstBusinessOnboardingProps>) {
  const [error, setError] = useState("")
  const { register, handleSubmit, formState } = useForm<
    FirstBusinessFormInput,
    unknown,
    FirstBusinessFormValues
  >({
    resolver: zodResolver(firstBusinessSchema),
    defaultValues: {
      displayName: "",
      legalName: "",
      ruc: "",
      currencyCode: "PEN",
      openingBalanceAmount: "0",
      openingBalanceDate: today(),
    },
  })
  async function submit(values: FirstBusinessFormValues): Promise<void> {
    setError("")
    try {
      const result = await createBusiness(values, accessToken)
      await onCreated(result)
    } catch (exception) {
      setError(
        isApiError(exception)
          ? exception.message
          : "No fue posible crear el espacio de tu negocio.",
      )
    }
  }
  return (
    <div
      role="dialog"
      className={styles.overlay}
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className={styles.wizard}>
        <aside>
          <div className={styles.brand}>
            <span>M</span>Mype
          </div>
          <div>
            <p>Configuración inicial</p>
            <h2>Prepara tu negocio para empezar.</h2>
          </div>
          <ol>
            <li className={styles.active}>1. Datos de tu negocio</li>
            <li>2. Productos</li>
            <li>3. Finalizar</li>
          </ol>
        </aside>
        <main>
          <header>
            <span>Paso 1 de 3</span>
            <h1 id="onboarding-title">Cuéntanos sobre tu negocio</h1>
            <p>
              Crearemos el espacio de trabajo, las categorías y el saldo de
              apertura.
            </p>
          </header>
          <form onSubmit={handleSubmit(submit)} noValidate>
            {error ? (
              <div role="alert" className={styles.alert}>
                {error}
              </div>
            ) : null}
            <div className={styles.fields}>
              <label className={styles.fullWidth}>
                Nombre de tu negocio <input {...register("displayName")} />
                <small className={styles.fieldError} aria-live="polite">
                  {formState.errors.displayName?.message ?? ""}
                </small>
              </label>
              <label className={styles.fullWidth}>
                Razón social (opcional) <input {...register("legalName")} />
                <small className={styles.fieldError} aria-live="polite">
                  {formState.errors.legalName?.message ?? ""}
                </small>
              </label>
              <label>
                RUC (opcional){" "}
                <input
                  inputMode="numeric"
                  maxLength={11}
                  {...register("ruc")}
                />
                <small className={styles.fieldError} aria-live="polite">
                  {formState.errors.ruc?.message ?? ""}
                </small>
              </label>
              {/* <label>
                Moneda <input maxLength={3} {...register("currencyCode")} />
                {formState.errors.currencyCode && (
                  <small>{formState.errors.currencyCode.message}</small>
                )}
              </label> */}
              <label>
                Saldo de apertura
                <div
                  className={`${styles.currencyInput} ${
                    formState.errors.openingBalanceAmount
                      ? styles.inputError
                      : ""
                  }`}
                >
                  <span aria-hidden="true">S/</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    aria-label="Saldo de apertura"
                    aria-invalid={Boolean(
                      formState.errors.openingBalanceAmount,
                    )}
                    {...register("openingBalanceAmount")}
                  />
                </div>
                <small className={styles.fieldError} aria-live="polite">
                  {formState.errors.openingBalanceAmount?.message ?? ""}
                </small>
              </label>
              {/* <label>
                Fecha de apertura{" "}
                <input type="date" {...register("openingBalanceDate")} />
                {formState.errors.openingBalanceDate && (
                  <small>{formState.errors.openingBalanceDate.message}</small>
                )}
              </label> */}
            </div>
            <button type="submit" disabled={formState.isSubmitting}>
              {formState.isSubmitting
                ? "Creando..."
                : "Crear negocio y continuar"}
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}

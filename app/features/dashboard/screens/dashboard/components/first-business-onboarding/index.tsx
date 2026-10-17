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
import { buildDefaultValues } from "./utils"

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
    defaultValues: buildDefaultValues(today()),
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
      className="fixed inset-0 z-100 overflow-auto bg-[#eaf0fa] p-0 min-[801px]:p-6"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="mx-auto grid min-h-screen w-full grid-cols-1 overflow-hidden rounded-none bg-white shadow-[0_30px_75px_rgba(28,57,108,0.16)] min-[801px]:min-h-[calc(100vh-48px)] min-[801px]:max-w-[1120px] min-[801px]:grid-cols-[320px_1fr] min-[801px]:rounded-3xl">
        <aside className="flex flex-col justify-between gap-[25px] bg-linear-to-br from-[#0c2c68] to-[#1549aa] px-8 py-[38px] text-white min-[801px]:gap-0">
          <div className="flex items-center gap-2.5 font-[850] [&>span]:grid [&>span]:size-[38px] [&>span]:place-items-center [&>span]:rounded-[10px] [&>span]:bg-white [&>span]:text-[#174498]">
            <span>M</span>Mype
          </div>
          <div>
            <p className="text-[0.72rem] font-[850] text-[#afc8ff] uppercase">
              Configuración inicial
            </p>
            <h2 className="text-[1.8rem] leading-[1.08] tracking-[-0.04em] min-[801px]:text-[2.2rem]">
              Prepara tu negocio para empezar.
            </h2>
          </div>
          <ol className="hidden list-none gap-3 p-0 min-[801px]:grid">
            <li className="rounded-xl bg-[rgba(255,255,255,0.12)] p-3 text-white">
              1. Datos de tu negocio
            </li>
            <li className="rounded-xl p-3 text-[#bdd0f3]">2. Productos</li>
            <li className="rounded-xl p-3 text-[#bdd0f3]">3. Finalizar</li>
          </ol>
        </aside>
        <main className="p-[30px_20px] min-[561px]:p-[clamp(34px,6vw,70px)]">
          <header className="[&>span]:text-[0.73rem] [&>span]:font-[850] [&>span]:text-[#2b5fce] [&>span]:uppercase [&>p]:text-[#707c92]">
            <span>Paso 1 de 3</span>
            <h1
              className="my-[9px] text-[clamp(2rem,4vw,3rem)] tracking-[-0.04em] text-[#14223d]"
              id="onboarding-title"
            >
              Cuéntanos sobre tu negocio
            </h1>
            <p>
              Crearemos el espacio de trabajo, las categorías y el saldo de
              apertura.
            </p>
          </header>
          <form
            className="mt-9 grid gap-6"
            onSubmit={handleSubmit(submit)}
            noValidate
          >
            {error ? (
              <div
                role="alert"
                className="rounded-[10px] border border-[#efb8c2] bg-[#fff1f3] p-3 text-[#9f2137]"
              >
                {error}
              </div>
            ) : null}
            <div className="grid grid-cols-1 gap-[18px] min-[561px]:grid-cols-2 [&_label]:grid [&_label]:min-w-0 [&_label]:gap-[7px] [&_label]:text-[0.8rem] [&_label]:font-[750] [&_label]:text-[#33415a] [&_label>input]:min-h-12 [&_label>input]:w-full [&_label>input]:min-w-0 [&_label>input]:rounded-xl [&_label>input]:border [&_label>input]:border-[#d2d9e6] [&_label>input]:bg-white [&_label>input]:px-[13px] [&_label>input]:text-[#14223d] [&_label>input]:outline-2 [&_label>input]:outline-offset-1 [&_label>input]:outline-transparent [&_label>input]:transition-[border-color,box-shadow,outline-color] [&_label>input]:duration-[120ms] [&_label>input:focus]:border-[#2458d1] [&_label>input:focus]:shadow-[0_0_0_3px_rgba(36,88,209,0.12)] [&_label>input:focus]:outline-[#2458d1] [&_label>input[aria-invalid=true]]:border-[#b3263e] [&_label>input[aria-invalid=true]]:outline-[#b3263e] [&_label>input[aria-invalid=true]:focus]:shadow-[0_0_0_3px_rgba(179,38,62,0.12)]">
              <label className="min-[561px]:col-span-full">
                Nombre de tu negocio <input {...register("displayName")} />
                <small
                  className="block min-h-[0.9rem] text-[0.72rem] leading-[1.25] font-semibold text-[#b3263e]"
                  aria-live="polite"
                >
                  {formState.errors.displayName?.message ?? ""}
                </small>
              </label>
              <label className="min-[561px]:col-span-full">
                Razón social (opcional) <input {...register("legalName")} />
                <small
                  className="block min-h-[0.9rem] text-[0.72rem] leading-[1.25] font-semibold text-[#b3263e]"
                  aria-live="polite"
                >
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
                <small
                  className="block min-h-[0.9rem] text-[0.72rem] leading-[1.25] font-semibold text-[#b3263e]"
                  aria-live="polite"
                >
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
                  className={`flex min-h-12 items-center overflow-hidden rounded-xl border bg-white outline-2 outline-offset-1 transition-[border-color,box-shadow,outline-color] duration-[120ms] focus-within:border-[#2458d1] focus-within:shadow-[0_0_0_3px_rgba(36,88,209,0.12)] focus-within:outline-[#2458d1] [&>span]:flex [&>span]:min-w-12 [&>span]:self-stretch [&>span]:items-center [&>span]:justify-center [&>span]:border-r [&>span]:px-3 [&>span]:text-[0.84rem] [&>span]:font-extrabold [&>input]:flex-1 [&>input]:appearance-none [&>input]:rounded-none [&>input]:border-0 [&>input]:shadow-none [&>input]:outline-0 ${formState.errors.openingBalanceAmount ? "border-[#b3263e] outline-[#b3263e] focus-within:border-[#b3263e] focus-within:shadow-[0_0_0_3px_rgba(179,38,62,0.12)] focus-within:outline-[#b3263e] [&>span]:border-[#b3263e] [&>span]:bg-[#fff1f3] [&>span]:text-[#9f2137]" : "border-[#d2d9e6] outline-transparent [&>span]:border-[#d2d9e6] [&>span]:bg-[#f3f6fb] [&>span]:text-[#46546d]"}`}
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
                <small
                  className="block min-h-[0.9rem] text-[0.72rem] leading-[1.25] font-semibold text-[#b3263e]"
                  aria-live="polite"
                >
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
            <button
              className="min-h-12 w-full cursor-pointer justify-self-end rounded-xl border-0 bg-[#2458d1] px-5 font-[850] text-white min-[561px]:w-auto"
              type="submit"
              disabled={formState.isSubmitting}
            >
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

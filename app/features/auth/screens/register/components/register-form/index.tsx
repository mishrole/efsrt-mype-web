import { FormField } from "../../../../components/form-field"
import { PasswordField } from "../../../../components/password-field"
import { useRegister } from "../../hooks/use-register"

export function RegisterForm() {
  const { form, submit, submitError, isSubmitting } = useRegister()
  return (
    <form
      className="grid gap-5"
      onSubmit={form.handleSubmit(submit)}
      noValidate
    >
      {submitError ? (
        <div
          className="rounded-xl border border-[#f1b8c2] bg-[#fff1f3] px-3.5 py-3 text-[0.88rem] text-[#9f2137]"
          role="alert"
        >
          {submitError}
        </div>
      ) : null}
      <FormField
        id="register-name"
        label="Nombre"
        autoComplete="name"
        placeholder="Tu nombre"
        error={form.formState.errors.displayName?.message}
        {...form.register("displayName")}
      />
      <FormField
        id="register-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="nombre@negocio.com"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      <PasswordField
        id="register-password"
        label="Contraseña"
        autoComplete="new-password"
        placeholder="********"
        error={form.formState.errors.password?.message}
        {...form.register("password")}
      />
      <p className="-mt-[0.8125rem] mb-0 text-[0.78rem] leading-6 text-[#778198]">
        Usa al menos 8 caracteres, una letra y un número.
      </p>
      <PasswordField
        id="register-confirmation"
        label="Confirmar contraseña"
        autoComplete="new-password"
        placeholder="********"
        error={form.formState.errors.passwordConfirmation?.message}
        {...form.register("passwordConfirmation")}
      />
      <button
        className="min-h-[3.375rem] cursor-pointer rounded-[0.875rem] border-0 bg-linear-to-br from-[#2258dc] to-[#1745ba] px-5 font-extrabold text-white shadow-[0_0.75rem_1.625rem_rgba(34,88,220,0.23)] transition-transform hover:not-disabled:-translate-y-px disabled:cursor-wait disabled:opacity-64"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  )
}

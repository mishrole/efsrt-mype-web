import { FormField } from "../../../../components/form-field"
import { PasswordField } from "../../../../components/password-field"
import { useLogin } from "../../hooks/use-login"

export function LoginForm() {
  const { form, submit, submitError, isSubmitting } = useLogin()
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
        id="login-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="nombre@negocio.com"
        error={form.formState.errors.email?.message}
        {...form.register("email")}
      />
      <PasswordField
        id="login-password"
        label="Contraseña"
        autoComplete="current-password"
        error={form.formState.errors.password?.message}
        placeholder="********"
        {...form.register("password")}
      />
      <button
        className="min-h-[3.375rem] cursor-pointer rounded-[0.875rem] border-0 bg-linear-to-br from-[#2258dc] to-[#1745ba] px-5 font-extrabold text-white shadow-[0_0.75rem_1.625rem_rgba(34,88,220,0.23)] transition-transform hover:not-disabled:-translate-y-px disabled:cursor-wait disabled:opacity-64"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  )
}

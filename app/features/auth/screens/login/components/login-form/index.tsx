import { FormField } from "../../../../components/form-field"
import { PasswordField } from "../../../../components/password-field"
import { useLogin } from "../../hooks/use-login"
import styles from "./styles.module.css"

export function LoginForm() {
  const { form, submit, submitError, isSubmitting } = useLogin()

  return (
    <form
      className={styles.form}
      onSubmit={form.handleSubmit(submit)}
      noValidate
    >
      {submitError ? (
        <div className={styles.alert} role="alert">
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
      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  )
}

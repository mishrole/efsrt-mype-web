import { FormField } from "../../../../components/form-field"
import { PasswordField } from "../../../../components/password-field"
import { useRegister } from "../../hooks/use-register"
import styles from "./styles.module.css"

export function RegisterForm() {
  const { form, submit, submitError, isSubmitting } = useRegister()

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
        id="register-name"
        label="Nombre para mostrar"
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
      <p className={styles.hint}>
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
      <button className={styles.submit} type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
      </button>
    </form>
  )
}

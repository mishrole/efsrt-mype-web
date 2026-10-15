import { Link } from "react-router"
import { AuthLayout } from "../../components/auth-layout"
import { RegisterForm } from "./components/register-form"

export function meta() {
  return [{ title: "Crear cuenta | Mype" }]
}

export default function RegisterScreen() {
  return (
    <AuthLayout
      eyebrow="Empieza hoy"
      title="Crea tu cuenta"
      description="Registra tus credenciales. Después podrás crear y configurar tu negocio."
      footer={
        <p>
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthLayout>
  )
}

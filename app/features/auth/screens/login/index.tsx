import { Link } from "react-router"
import { AuthLayout } from "../../components/auth-layout"
import { LoginForm } from "./components/login-form"

export function meta() {
  return [{ title: "Iniciar sesión | Mype" }]
}

export default function LoginScreen() {
  return (
    <AuthLayout
      eyebrow="Bienvenido"
      title="Inicia sesión"
      description="Accede con las credenciales registradas en Mype."
      footer={
        <p>
          ¿Aún no tienes una cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}

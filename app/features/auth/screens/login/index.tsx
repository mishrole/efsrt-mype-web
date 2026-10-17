import { Link } from "react-router"
import { FullScreenLoading } from "~/shared/components/full-screen-loading"
import { useAuthenticatedRouteRedirect } from "~/shared/hooks/use-authenticated-route-redirect"
import { AuthLayout } from "../../components/auth-layout"
import { LoginForm } from "./components/login-form"

export function meta() {
  return [{ title: "Iniciar sesión | Mype" }]
}

export default function LoginScreen() {
  const redirecting = useAuthenticatedRouteRedirect()

  if (redirecting) {
    return <FullScreenLoading message="Cargando tu negocio..." />
  }

  return (
    <AuthLayout
      eyebrow="Bienvenido"
      title="Inicia sesión"
      description="Accede a Mype y administra tu negocio"
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

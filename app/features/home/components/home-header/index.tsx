import { Link } from "react-router"
import type { HomeHeaderProps } from "./interfaces"
import styles from "./styles.module.css"
import { scrollToSection } from "./utils"

export function HomeHeader({
  loginPath = "/login",
  registerPath = "/register",
}: HomeHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link className={styles.brand} to="/" aria-label="Ir al inicio de Mype">
          <span className={styles.brandMark} aria-hidden="true">
            M
          </span>
          <span>Mype</span>
        </Link>

        <nav className={styles.navigation} aria-label="Navegación principal">
          <button type="button" onClick={() => scrollToSection("beneficios")}>
            Beneficios
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("como-funciona")}
          >
            Cómo funciona
          </button>

          <button type="button" onClick={() => scrollToSection("seguridad")}>
            Seguridad
          </button>
        </nav>

        <div className={styles.actions}>
          <Link className={styles.login} to={loginPath}>
            Iniciar sesión
          </Link>
          <Link className={styles.register} to={registerPath}>
            Crear cuenta
          </Link>
        </div>
      </div>
    </header>
  )
}

import { Link } from "react-router"
import type { HomeCtaProps } from "./interfaces"
import styles from "./styles.module.css"

export function HomeCta({
  registerPath = "/register",
}: Readonly<HomeCtaProps>) {
  return (
    <section className={styles.section}>
      <div>
        <span>Empieza con una vista clara</span>
        <h2>Ordena hoy las finanzas de tu negocio.</h2>
        <p>Crea tu cuenta y configura el primer negocio en pocos pasos.</p>
      </div>
      <Link to={registerPath}>Crear cuenta gratis</Link>
    </section>
  )
}

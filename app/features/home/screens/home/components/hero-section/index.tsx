import { Link } from "react-router"
import type { HeroSectionProps } from "./interfaces"
import styles from "./styles.module.css"

export function HeroSection({
  registerPath = "/register",
  loginPath = "/login",
}: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.copy}>
        <span className={styles.badge}>
          Finanzas simples para negocios que avanzan
        </span>
        <h1>
          Entiende tu caja.
          <br />
          <span>Decide con claridad.</span>
        </h1>
        <p className={styles.description}>
          Mype reúne ventas, gastos y saldos en una vista práctica para que
          puedas controlar el negocio sin depender de hojas dispersas.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryAction} to={registerPath}>
            Crear cuenta gratis
          </Link>
          <Link className={styles.secondaryAction} to={loginPath}>
            Ya tengo una cuenta
          </Link>
        </div>
        <div
          className={styles.assurances}
          aria-label="Características del servicio"
        >
          <span>Sin tarjeta</span>
          <span>Configuración rápida</span>
          <span>Datos protegidos</span>
        </div>
      </div>

      <div
        className={styles.preview}
        aria-label="Vista previa del dashboard financiero"
      >
        <div className={styles.previewHeader}>
          <div>
            <span className={styles.previewLabel}>Resumen financiero</span>
            <strong>Octubre 2026</strong>
          </div>
          <span className={styles.status}>Actualizado</span>
        </div>

        <div className={styles.metrics}>
          <article>
            <span>Saldo actual</span>
            <strong>S/ 12,840.00</strong>
            <small>+12.4% este mes</small>
          </article>
          <article>
            <span>Ingresos</span>
            <strong>S/ 8,420.00</strong>
            <small>42 movimientos</small>
          </article>
          <article>
            <span>Gastos</span>
            <strong>S/ 3,180.00</strong>
            <small>18 movimientos</small>
          </article>
        </div>

        <div className={styles.chart} aria-hidden="true">
          <div className={styles.chartHeading}>
            <span>Flujo de caja</span>
            <strong>S/ 5,240 neto</strong>
          </div>
          <div className={styles.chartGrid}>
            <span style={{ height: "34%" }}></span>
            <span style={{ height: "48%" }}></span>
            <span style={{ height: "42%" }}></span>
            <span style={{ height: "66%" }}></span>
            <span style={{ height: "54%" }}></span>
            <span style={{ height: "78%" }}></span>
            <span style={{ height: "88%" }}></span>
          </div>
        </div>
      </div>
    </section>
  )
}

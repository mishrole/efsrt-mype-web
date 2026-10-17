import type { AuthLayoutProps } from "./interfaces"
import styles from "./styles.module.css"

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
}: Readonly<AuthLayoutProps>) {
  return (
    <main className={styles.page}>
      <section className={styles.brandPanel} aria-label="Presentación de Mype">
        <a className={styles.brand} href="/" aria-label="Ir al inicio de Mype">
          <span className={styles.brandMark} aria-hidden="true">
            M
          </span>
          <span>Mype</span>
        </a>

        <div className={styles.brandCopy}>
          <p className={styles.brandEyebrow}>Control financiero simple</p>
          <h2>Decisiones más claras para el día a día de tu negocio</h2>
          <p>
            Registra ingresos y gastos, consulta el flujo de caja y mantén tu
            información financiera en un solo lugar.
          </p>
        </div>

        <div
          className={styles.brandSummary}
          aria-label="Beneficios principales"
        >
          <span>Información ordenada</span>
          <span>Acceso seguro</span>
          <span>Control total</span>
        </div>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.card}>
          <header>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1>{title}</h1>
            <p className={styles.description}>{description}</p>
          </header>
          {children}
          <footer className={styles.footer}>{footer}</footer>
        </div>
      </section>
    </main>
  )
}

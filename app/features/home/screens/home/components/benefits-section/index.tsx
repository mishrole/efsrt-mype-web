import styles from "./styles.module.css"

export function BenefitsSection() {
  return (
    <section className={styles.section} id="beneficios">
      <div className={styles.heading}>
        <span>Todo en un solo lugar</span>
        <h2>
          Menos tiempo ordenando datos.
          <br />
          Más tiempo dirigiendo tu negocio.
        </h2>
        <p>
          Un flujo simple para registrar operaciones y entender qué pasa con tu
          dinero.
        </p>
      </div>

      <div className={styles.grid}>
        <article className={styles.card}>
          <span className={styles.icon} aria-hidden="true">
            ↗
          </span>
          <h3>Ventas y gastos claros</h3>
          <p>
            Registra movimientos con detalle, categorías y evidencias sin
            perderle el rastro.
          </p>
        </article>
        <article className={styles.card}>
          <span className={styles.icon} aria-hidden="true">
            ▦
          </span>
          <h3>Dashboard financiero</h3>
          <p>Consulta saldos, entradas, salidas, costes y tendencias.</p>
        </article>
        <article className={styles.card}>
          <span className={styles.icon} aria-hidden="true">
            ◎
          </span>
          <h3>Información consistente</h3>
          <p>Mantén productos, categorías y movimientos en un solo lugar.</p>
        </article>
      </div>
    </section>
  )
}

import styles from "./styles.module.css"

export function HowItWorksSection() {
  return (
    <section className={styles.section} id="como-funciona">
      <div className={styles.content}>
        <div className={styles.copy}>
          <span>Empieza sin complicaciones</span>
          <h2>Tu operación financiera lista en tres pasos.</h2>
          <p>
            Crea el espacio de tu negocio, organiza la información base y
            empieza a registrar el movimiento real.
          </p>
        </div>

        <ol className={styles.steps}>
          <li>
            <span>01</span>
            <div>
              <strong>Crea tu cuenta</strong>
              <p>Registra tus credenciales para acceder de forma segura.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Configura tu negocio</strong>
              <p>Define moneda, saldo de apertura, categorías y productos.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Controla tu caja</strong>
              <p>
                Registra ventas y gastos, añade evidencias y consulta tu resumen
                financiero.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  )
}

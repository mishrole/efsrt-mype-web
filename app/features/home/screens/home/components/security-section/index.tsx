import styles from "./styles.module.css"

export function SecuritySection() {
  return (
    <section className={styles.section} id="seguridad">
      <div className={styles.badge} aria-hidden="true">
        ✓
      </div>
      <div>
        <span>Acceso por negocio</span>
        <h2>La información correcta, para las personas autorizadas.</h2>
        <p>
          Las operaciones se mantienen aisladas por negocio y los permisos se
          validan en cada acceso.
        </p>
      </div>
      <ul>
        <li>Autenticación segura</li>
        <li>Permisos por membresía y rol</li>
        <li>Historial financiero conservado</li>
      </ul>
    </section>
  )
}

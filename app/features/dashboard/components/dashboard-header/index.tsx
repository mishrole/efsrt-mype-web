import type { DashboardHeaderProps } from "./interfaces"
import styles from "./styles.module.css"

export function DashboardHeader({
  businesses,
  currentBusinessId,
  displayName,
  onBusinessChange,
  onLogout,
}: Readonly<DashboardHeaderProps>) {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <a className={styles.brand} href="/" aria-label="Ir al inicio de Mype">
          <span aria-hidden="true">M</span> Mype
        </a>
        <div className={styles.actions}>
          <label className={styles.selector}>
            <span>Negocio</span>
            <select
              value={currentBusinessId}
              onChange={(event) => onBusinessChange(event.target.value)}
            >
              {businesses.map((business) => (
                <option key={business.businessId} value={business.businessId}>
                  {business.displayName}
                </option>
              ))}
            </select>
          </label>
          <span className={styles.user}>{displayName}</span>
          <button type="button" onClick={() => void onLogout()}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}

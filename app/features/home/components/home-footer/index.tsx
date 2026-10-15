import { Link } from "react-router"
import styles from "./styles.module.css"

export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <Link className={styles.brand} to="/">
          <span aria-hidden="true">M</span>Mype
        </Link>
        <p>Control financiero simple para pequeños negocios.</p>
        <small>© 2026 Mype</small>
      </div>
    </footer>
  )
}

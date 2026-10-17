import type { DashboardLayoutProps } from "./interfaces"
import styles from "./styles.module.css"

export function DashboardLayout({
  header,
  children,
}: Readonly<DashboardLayoutProps>) {
  return (
    <div className={styles.page}>
      {header}
      <main className={styles.main}>{children}</main>
    </div>
  )
}

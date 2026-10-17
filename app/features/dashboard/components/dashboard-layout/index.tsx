import type { DashboardLayoutProps } from "./interfaces"

export function DashboardLayout({
  header,
  children,
}: Readonly<DashboardLayoutProps>) {
  return (
    <div className="min-h-screen min-w-80 bg-[#f5f7fb] text-[#172033] box-border before:box-border after:box-border [&_*]:box-border [&_*::before]:box-border [&_*::after]:box-border">
      {header}
      <main className="mx-auto w-full max-w-[1420px] px-3.5 pt-[22px] pb-10 min-[641px]:px-6 min-[641px]:pt-[30px] min-[641px]:pb-14">
        {children}
      </main>
    </div>
  )
}

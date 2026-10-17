import type { AuthLayoutProps } from "./interfaces"

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
}: Readonly<AuthLayoutProps>) {
  return (
    <main className="grid min-h-dvh grid-cols-1 bg-[#f4f7fb] text-[#172033] lg:grid-cols-[minmax(22.5rem,0.9fr)_minmax(28.75rem,1.1fr)]">
      <section
        className="relative flex min-h-auto flex-col justify-between gap-[3.375rem] overflow-hidden bg-[radial-gradient(circle_at_80%_18%,rgba(73,132,255,0.7),transparent_28%),linear-gradient(145deg,#0a275e_0%,#1248a0_52%,#0d3174_100%)] px-6 pt-[1.875rem] pb-[2.375rem] text-white after:absolute after:right-[-8.125rem] after:bottom-[-10rem] after:size-[26.875rem] after:rounded-full after:border after:border-[rgba(255,255,255,0.18)] after:shadow-[0_0_0_4.375rem_rgba(255,255,255,0.04),0_0_0_8.75rem_rgba(255,255,255,0.03)] after:content-[''] lg:min-h-dvh lg:gap-0 lg:px-[clamp(2.5rem,6vw,5.5rem)] lg:py-12"
        aria-label="Presentación de Mype"
      >
        <a
          className="relative z-10 flex w-fit items-center gap-3 text-[1.35rem] font-extrabold text-white no-underline"
          href="/"
          aria-label="Ir al inicio de Mype"
        >
          <span
            className="grid size-[2.625rem] place-items-center rounded-[0.8125rem] bg-white font-black text-[#123c86]"
            aria-hidden="true"
          >
            M
          </span>
          <span>Mype</span>
        </a>
        <div className="relative z-10 max-w-[38.125rem]">
          <p className="mb-2.5 text-[0.78rem] font-extrabold tracking-[0.13em] text-[#bcd1ff] uppercase">
            Control financiero simple
          </p>
          <h2 className="m-0 max-w-[36.875rem] text-[2.2rem] leading-[1.03] tracking-[-0.045em] lg:text-[clamp(2.2rem,4.2vw,4.6rem)]">
            Decisiones más claras para el día a día de tu negocio
          </h2>
          <p className="mt-6 hidden max-w-[33.75rem] text-[1.08rem] leading-[1.7] text-[#d8e4ff] lg:block">
            Registra ingresos y gastos, consulta el flujo de caja y mantén tu
            información financiera en un solo lugar.
          </p>
        </div>
        <div
          className="relative z-10 hidden flex-wrap gap-2.5 lg:flex"
          aria-label="Beneficios principales"
        >
          {["Información ordenada", "Acceso seguro", "Control total"].map(
            (benefit) => (
              <span
                className="rounded-full border border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.08)] px-[0.8125rem] py-[0.5625rem] text-[0.82rem] text-[#e8efff]"
                key={benefit}
              >
                {benefit}
              </span>
            ),
          )}
        </div>
      </section>
      <section className="grid min-h-auto place-items-center px-[1.375rem] py-[3.25rem] lg:min-h-dvh lg:px-6 lg:py-11">
        <div className="w-full max-w-[30rem]">
          <header>
            <p className="mb-2.5 text-[0.78rem] font-extrabold tracking-[0.13em] text-[#4c73d7] uppercase">
              {eyebrow}
            </p>
            <h1 className="m-0 text-[clamp(2rem,5vw,3rem)] leading-[1.05] tracking-[-0.04em] text-[#111a2c]">
              {title}
            </h1>
            <p className="mt-4 mb-[1.875rem] leading-[1.65] text-[#667085]">
              {description}
            </p>
          </header>
          {children}
          <footer className="mt-7 text-center text-[0.9rem] text-[#667085] [&_a]:font-bold [&_a]:text-[#2457d6] [&_a]:no-underline hover:[&_a]:underline">
            {footer}
          </footer>
        </div>
      </section>
    </main>
  )
}

import { Link } from "react-router"
import { ASSURANCE_LABELS, CHART_BAR_HEIGHTS, METRIC_CARDS } from "./constants"
import type { HeroSectionProps } from "./interfaces"
import styles from "./styles.module.css"

export function HeroSection({
  registerPath = "/register",
  loginPath = "/login",
}: Readonly<HeroSectionProps>) {
  return (
    <section
      className={`${styles.heroDecoration} relative mx-auto grid w-[calc(100%-1.75rem)] max-w-[73.75rem] grid-cols-1 items-center justify-items-center gap-12 py-14 sm:w-[calc(100%-2.5rem)] sm:gap-14 sm:py-16 md:w-[calc(100%-3rem)] md:gap-16 md:py-20 lg:w-[calc(100%-3.5rem)] lg:py-24 xl:grid-cols-[minmax(0,0.92fr)_minmax(32.5rem,1.08fr)] xl:justify-items-stretch xl:gap-[clamp(3.25rem,7vw,6.25rem)] xl:py-[5.75rem_6.875rem]`}
    >
      <div className="relative z-10 w-full max-w-[45rem] text-center xl:max-w-none xl:text-left">
        <span className="inline-flex rounded-full border border-[#ccd9fb] bg-[#f2f6ff] px-3 py-2 text-[0.78rem] font-extrabold tracking-[0.03em] text-[#2455c3]">
          Finanzas simples para negocios que avanzan
        </span>

        <h1 className="my-6 text-[clamp(3rem,12vw,4rem)] leading-[0.98] font-normal tracking-[-0.06em] text-[#10203d] md:text-[clamp(4rem,8vw,5rem)] xl:text-[clamp(4.5rem,5.5vw,5.5rem)]">
          Conoce los números
          <br />
          <span className="text-[#2860df]">que mueven tu negocio</span>
        </h1>

        <p className="mx-auto max-w-[38.75rem] text-base leading-7 text-[#606c82] sm:text-[1.08rem] sm:leading-[1.75] xl:mx-0">
          Registra tus ventas, gastos y evidencias en un solo lugar y conoce el
          estado real de tu negocio.
        </p>

        <div className="mt-8 flex flex-col flex-wrap justify-center gap-3.5 sm:flex-row xl:justify-start">
          <Link
            className="inline-flex min-h-13 w-full items-center justify-center rounded-[0.875rem] bg-linear-to-br from-[#2b63e4] to-[#1744b6] px-[1.3125rem] text-[0.93rem] font-extrabold text-white no-underline shadow-[0_0.875rem_2rem_rgba(31,84,207,0.25)] sm:w-auto"
            to={registerPath}
          >
            Crear cuenta gratis
          </Link>

          <Link
            className="inline-flex min-h-13 w-full items-center justify-center rounded-[0.875rem] border border-[#d5dcea] bg-white px-[1.3125rem] text-[0.93rem] font-extrabold text-[#263653] no-underline sm:w-auto"
            to={loginPath}
          >
            Ya tengo una cuenta
          </Link>
        </div>

        <div
          className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3 text-[0.77rem] text-[#758097] xl:justify-start"
          aria-label="Características del servicio"
        >
          {ASSURANCE_LABELS.map((label) => (
            <span className={styles.assurance} key={label}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div
        className={`${styles.preview} relative isolate w-full max-w-[45rem] rounded-[1.3125rem] border border-[rgba(173,190,222,0.55)] bg-[rgba(255,255,255,0.9)] p-4 shadow-[0_2.1875rem_5rem_rgba(20,55,113,0.16)] sm:rounded-[1.75rem] sm:p-6 xl:max-w-none xl:p-[1.625rem]`}
        aria-label="Vista previa del dashboard financiero"
      >
        <div className="flex items-center justify-between gap-5">
          <div className="grid gap-1">
            <span className="text-xs text-[#7a8599]">Resumen financiero</span>
            <strong className="text-[1.08rem] text-[#1d2c48]">
              Octubre 2026
            </strong>
          </div>

          <span className="rounded-full bg-[#e9f8f1] px-2.5 py-1.5 text-[0.7rem] font-extrabold text-[#24734f]">
            Actualizado
          </span>
        </div>

        <div className="my-6 grid grid-cols-1 gap-3 sm:grid-cols-[1.25fr_1fr_1fr]">
          {METRIC_CARDS.map((metric, index) => (
            <article
              className={`${index > 0 ? "hidden sm:grid" : "grid"} gap-2 rounded-[1.0625rem] border border-[#e5eaf3] bg-[#fbfcff] p-4`}
              key={metric.label}
            >
              <span className="text-xs text-[#7a8599]">{metric.label}</span>
              <strong className="text-[1.06rem] text-[#17253f]">
                {metric.value}
              </strong>
              <small className="text-[0.68rem] text-[#34815d]">
                {metric.detail}
              </small>
            </article>
          ))}
        </div>

        <div
          className="rounded-[1.125rem] bg-[#f5f8ff] p-4 sm:p-[1.125rem]"
          aria-hidden="true"
        >
          <div className="flex items-center justify-between gap-5">
            <span className="text-xs text-[#7a8599]">Flujo de caja</span>
            <strong className="text-[0.8rem] text-[#1f55c7]">
              S/ 5,240 neto
            </strong>
          </div>

          <div
            className={`${styles.chartGrid} mt-[1.125rem] flex h-[8.4375rem] items-end justify-around gap-2.5 border-b border-[#d8e0ef] sm:h-[10.9375rem] sm:gap-3.5`}
          >
            {CHART_BAR_HEIGHTS.map((height, index) => (
              <span
                className={styles.chartBar}
                key={`${height}-${index}`}
                style={{ height }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

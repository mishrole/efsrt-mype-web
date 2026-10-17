import { Link } from "react-router"
import type { HomeCtaProps } from "./interfaces"

export function HomeCta({
  registerPath = "/register",
}: Readonly<HomeCtaProps>) {
  return (
    <section className="mx-3.5 mb-[6.875rem] flex max-w-[73.75rem] flex-col items-start gap-9 overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_82%_12%,rgba(122,162,255,0.56),transparent_33%),linear-gradient(135deg,#12377f,#174eb8)] px-[1.6875rem] py-[2.125rem] text-white shadow-[0_1.5rem_3.4375rem_rgba(22,66,157,0.22)] sm:mx-5 lg:mx-7 xl:mx-auto xl:flex-row xl:items-center xl:justify-between xl:px-[3.375rem] xl:py-12">
      <div>
        <span className="text-[0.76rem] font-extrabold tracking-[0.12em] text-[#bed1ff] uppercase">
          Empieza con una vista clara
        </span>
        <h2 className="mt-[0.6875rem] mb-[0.5625rem] text-[clamp(2rem,4vw,3.2rem)] leading-[1.08] tracking-[-0.04em]">
          Ordena hoy las finanzas de tu negocio.
        </h2>
        <p className="m-0 text-[#d8e4ff]">
          Crea tu cuenta y configura tu primer negocio en pocos pasos.
        </p>
      </div>
      <Link
        className="inline-flex w-full flex-none items-center justify-center rounded-[0.875rem] bg-white px-[1.3125rem] py-4 text-center text-[0.9rem] font-extrabold text-[#1746a7] no-underline shadow-[0_0.75rem_1.875rem_rgba(5,24,70,0.18)] sm:w-auto"
        to={registerPath}
      >
        Crear cuenta gratis
      </Link>
    </section>
  )
}

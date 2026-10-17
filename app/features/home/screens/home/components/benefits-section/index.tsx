import { BENEFITS } from "./constants"

export function BenefitsSection() {
  return (
    <section
      className="bg-white px-3.5 py-16 sm:px-5 sm:py-20 md:px-6 lg:px-7 lg:py-24 xl:px-8 xl:py-[6.75rem] scroll-mt-16"
      id="beneficios"
    >
      <div className="mx-auto w-full max-w-[73.75rem]">
        <div className="mx-auto mb-[3.25rem] max-w-[47.5rem] text-center">
          <span className="text-[0.77rem] font-extrabold tracking-[0.13em] text-[#2c60d8] uppercase">
            Todo en un solo lugar
          </span>
          <h2 className="my-[0.9375rem] mb-[1.0625rem] text-[clamp(2rem,4vw,3.5rem)] leading-[1.1] tracking-[-0.045em] text-[#14223d]">
            Menos tiempo ordenando datos.
            <br />
            Más tiempo dirigiendo tu negocio.
          </h2>
          <p className="m-0 leading-[1.7] text-[#687389]">
            Un flujo simple para registrar operaciones y entender qué pasa con
            tu dinero.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <article
              className="rounded-[1.375rem] border border-[#e4e9f2] bg-linear-to-b from-white to-[#fafcff] p-[1.875rem] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_1.125rem_2.8125rem_rgba(28,62,118,0.09)]"
              key={benefit.title}
            >
              <span
                className="grid size-[2.8125rem] place-items-center rounded-[0.875rem] bg-[#eaf0ff] text-[1.15rem] font-black text-[#2155ce]"
                aria-hidden="true"
              >
                {benefit.icon}
              </span>
              <h3 className="mt-[1.375rem] mb-3 text-[1.12rem] text-[#182641]">
                {benefit.title}
              </h3>
              <p className="m-0 text-[0.91rem] leading-[1.7] text-[#69758a]">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

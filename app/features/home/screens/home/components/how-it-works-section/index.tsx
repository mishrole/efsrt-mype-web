import { STEPS } from "./constants"

export function HowItWorksSection() {
  return (
    <section
      className="bg-[#0d2d69] px-5 py-20 lg:py-28 scroll-mt-16"
      id="como-funciona"
    >
      <div className="mx-auto grid w-full max-w-[67.5rem] grid-cols-1 items-center gap-[clamp(3.125rem,9vw,7.5rem)] lg:grid-cols-[0.85fr_1.15fr]">
        <div className="text-center lg:text-left">
          <span className="text-[0.77rem] font-extrabold tracking-[0.13em] text-[#9bbaff] uppercase">
            Empieza sin complicaciones
          </span>
          <h2 className="mt-4 mb-5 text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.08] tracking-[-0.045em] text-white">
            Tu operación financiera lista en tres pasos.
          </h2>
          <p className="m-0 leading-[1.75] text-[#c2d1ef]">
            Crea el espacio de tu negocio, organiza la información base y
            empieza a registrar el movimiento real.
          </p>
        </div>
        <ol className="m-0 grid list-none gap-3.5 p-0">
          {STEPS.map((step) => (
            <li
              className="grid grid-cols-[auto_1fr] gap-[1.125rem] rounded-[1.125rem] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] p-[1.375rem]"
              key={step.number}
            >
              <span className="grid size-11 place-items-center rounded-xl bg-[#c9d9ff] text-[0.75rem] font-black text-[#0e347b]">
                {step.number}
              </span>
              <div>
                <strong className="text-base text-white">{step.title}</strong>
                <p className="mt-[0.4375rem] mb-0 text-[0.87rem] leading-[1.55] text-[#b9c9ea]">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

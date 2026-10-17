import { OPERATION_PREVIEW, SECURITY_FEATURES } from "./constants"

export function SecuritySection() {
  return (
    <section
      className="mx-auto pt-24 pb-8 w-[calc(100%-1.75rem)] max-w-[67.5rem] sm:w-[calc(100%-2.5rem)] md:w-[calc(100%-3rem)] lg:w-[calc(100%-3.5rem)] scroll-mt-16"
      id="seguridad"
    >
      <div className="grid grid-cols-1 items-center gap-[1.875rem] rounded-[1.625rem] border border-[#dfe6f3] bg-linear-to-br from-[#f8faff] to-[#eff4ff] p-[1.625rem] sm:grid-cols-[auto_1fr] sm:p-[2.375rem] lg:grid-cols-[auto_minmax(0,1.3fr)_minmax(0,0.8fr)]">
        <div
          className="grid size-[3.875rem] place-items-center rounded-[1.1875rem] bg-[#2258d5] text-[1.45rem] font-black text-white shadow-[0_0.75rem_1.875rem_rgba(34,88,213,0.23)]"
          aria-hidden="true"
        >
          ✓
        </div>
        <div>
          <span className="text-[0.75rem] font-extrabold tracking-[0.12em] text-[#2b5fce] uppercase">
            Acceso por negocio
          </span>
          <h2 className="my-2.5 text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.13] tracking-[-0.035em] text-[#14223d]">
            La información correcta, para las personas autorizadas.
          </h2>
          <p className="m-0 leading-[1.65] text-[#68758c]">
            Las operaciones se mantienen aisladas por negocio y los permisos se
            validan en cada acceso.
          </p>
        </div>
        <ul className="m-0 grid list-none gap-[0.8125rem] p-0 text-[0.87rem] font-bold text-[#33425f] sm:col-span-2 lg:col-span-1">
          {SECURITY_FEATURES.map((feature) => (
            <li className="flex gap-[0.5625rem]" key={feature}>
              <span className="text-[#27845a]" aria-hidden="true">
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto my-12 grid max-w-[60rem] grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(32rem,1.2fr)] lg:gap-14">
        <div className="text-center lg:text-left">
          <span className="text-[0.75rem] font-extrabold tracking-[0.12em] text-[#2b5fce] uppercase">
            Cada operación conserva su contexto
          </span>

          <h3 className="my-3 text-[clamp(1.7rem,3vw,2.5rem)] leading-[1.13] tracking-[-0.035em] text-[#14223d]">
            Revisa qué pasó sin reconstruir la historia.
          </h3>

          <p className="m-0 leading-[1.65] text-[#68758c]">
            Negocio, categoría, importe y evidencia permanecen vinculados al
            mismo movimiento.
          </p>
        </div>

        <div
          className="w-full max-w-[45rem] justify-self-center lg:max-w-none overflow-hidden rounded-[1.375rem] border border-[#dfe6f3] bg-white shadow-[0_1.5rem_3.75rem_rgba(20,55,113,0.12)]"
          aria-label="Ejemplo de una operación financiera respaldada"
        >
          <div className="flex items-center justify-between gap-4 border-b border-[#e7ebf2] bg-[#f8faff] px-5 py-4 sm:px-6">
            <div className="grid gap-1">
              <span className="text-[0.72rem] font-extrabold tracking-[0.08em] text-[#748096] uppercase">
                {OPERATION_PREVIEW.businessName}
              </span>
              <strong className="text-[#1d2c48]">
                {OPERATION_PREVIEW.description}
              </strong>
            </div>

            <span className="rounded-full bg-[#e9f8f1] px-3 py-1.5 text-[0.7rem] font-extrabold text-[#24734f]">
              {OPERATION_PREVIEW.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-6 px-5 py-6 sm:grid-cols-4 sm:px-6">
            <div className="grid gap-1">
              <span className="text-[0.72rem] text-[#7a8599]">Tipo</span>
              <strong className="text-[0.9rem] text-[#263653]">
                {OPERATION_PREVIEW.movementType}
              </strong>
            </div>
            <div className="grid gap-1">
              <span className="text-[0.72rem] text-[#7a8599]">Categoría</span>
              <strong className="text-[0.9rem] text-[#263653]">
                {OPERATION_PREVIEW.category}
              </strong>
            </div>
            <div className="grid gap-1">
              <span className="text-[0.72rem] text-[#7a8599]">Fecha</span>
              <strong className="text-[0.9rem] text-[#263653]">
                {OPERATION_PREVIEW.date}
              </strong>
            </div>
            <div className="grid gap-1">
              <span className="text-[0.72rem] text-[#7a8599]">Importe</span>
              <strong className="text-[1rem] text-[#2155ce]">
                {OPERATION_PREVIEW.amount}
              </strong>
            </div>
          </div>

          <div className="mx-5 mb-5 flex items-center gap-3 rounded-[0.875rem] border border-[#dce4f2] bg-[#f7f9fd] px-4 py-3 sm:mx-6 sm:mb-6">
            <span
              className="grid size-9 flex-none place-items-center rounded-[0.625rem] bg-[#e5edff] text-[0.85rem] font-black text-[#2458d1]"
              aria-hidden="true"
            >
              PDF
            </span>
            <div className="grid min-w-0 gap-0.5">
              <span className="text-[0.68rem] text-[#7a8599]">
                Evidencia adjunta
              </span>
              <strong className="truncate text-[0.82rem] text-[#34415a]">
                {OPERATION_PREVIEW.evidenceName}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import type { FullScreenLoadingProps } from "./interfaces"

const loaderDotClassName =
  "size-2.5 rounded-full bg-[#2458d1] motion-safe:animate-[full-screen-loading-pulse_900ms_infinite_ease-in-out] motion-reduce:animate-none motion-reduce:opacity-80"

export function FullScreenLoading({
  message = "Cargando...",
  overlay = false,
}: Readonly<FullScreenLoadingProps>) {
  return (
    <div
      className={`z-[900] flex items-center justify-center bg-[rgba(245,247,251,0.94)] text-[#30405f] ${
        overlay ? "fixed inset-0" : "min-h-dvh w-full"
      }`}
      role="status"
      aria-live="polite"
    >
      <style>{`
        @keyframes full-screen-loading-pulse {
          0%, 100% { opacity: 0.35; transform: translateY(0) scale(0.8); }
          50% { opacity: 1; transform: translateY(-7px) scale(1); }
        }
      `}</style>
      <div className="grid justify-items-center gap-[18px]">
        <span
          className="flex h-[30px] items-center gap-[7px]"
          aria-hidden="true"
        >
          <i className={loaderDotClassName} />
          <i className={`${loaderDotClassName} [animation-delay:120ms]`} />
          <i className={`${loaderDotClassName} [animation-delay:240ms]`} />
        </span>
        <p className="m-0 text-[0.9rem] font-[750]">{message}</p>
      </div>
    </div>
  )
}

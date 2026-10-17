export interface AbortableRequestController {
  createSignal: () => AbortSignal
  abort: () => void
}

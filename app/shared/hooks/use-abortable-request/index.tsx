import { useCallback, useEffect, useRef } from "react"

import type { AbortableRequestController } from "./interfaces"

export function useAbortableRequest(): AbortableRequestController {
  const controllerRef = useRef<AbortController | null>(null)

  const abort = useCallback((): void => {
    controllerRef.current?.abort()
    controllerRef.current = null
  }, [])

  const createSignal = useCallback((): AbortSignal => {
    abort()

    const controller = new AbortController()

    controllerRef.current = controller

    return controller.signal
  }, [abort])

  useEffect(() => abort, [abort])

  return {
    createSignal,
    abort,
  }
}

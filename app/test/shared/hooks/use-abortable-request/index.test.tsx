import { act, renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { useAbortableRequest } from "~/shared/hooks/use-abortable-request"

describe("useAbortableRequest", () => {
  it("creates an active abort signal", () => {
    const { result } = renderHook(() => useAbortableRequest())

    let signal: AbortSignal

    act(() => {
      signal = result.current.createSignal()
    })

    expect(signal!.aborted).toBe(false)
  })

  it("aborts the request in flight before creating another signal", () => {
    const { result } = renderHook(() => useAbortableRequest())

    let firstSignal: AbortSignal
    let secondSignal: AbortSignal

    act(() => {
      firstSignal = result.current.createSignal()
      secondSignal = result.current.createSignal()
    })

    expect(firstSignal!.aborted).toBe(true)
    expect(secondSignal!.aborted).toBe(false)
  })

  it("aborts the current request explicitly and remains idempotent", () => {
    const { result } = renderHook(() => useAbortableRequest())

    let signal: AbortSignal

    act(() => {
      signal = result.current.createSignal()
      result.current.abort()
      result.current.abort()
    })

    expect(signal!.aborted).toBe(true)
  })

  it("aborts the request in flight when the consumer unmounts", () => {
    const abortSpy = vi.spyOn(AbortController.prototype, "abort")
    const { result, unmount } = renderHook(() => useAbortableRequest())

    act(() => {
      result.current.createSignal()
    })

    unmount()

    expect(abortSpy).toHaveBeenCalledOnce()

    abortSpy.mockRestore()
  })
})

import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useMovementDraftCreate } from "~/features/financial-movements/screens/movement-draft-create/hooks/use-movement-draft-create"
import { createFinancialMovementDraft } from "~/services/financial-movements/create-financial-movement-draft"
import { APP_PATHS } from "~/shared/constants/pages"
import { createApiError } from "~/shared/http/errors"

const navigateMock = vi.fn()
const paramsState = { movementType: "sale" }
const authState = { accessToken: "access-token" as string | null }
const businessState = { currentBusinessId: "business-id" as string | null }
vi.mock("react-router", () => ({
  useNavigate: () => navigateMock,
  useParams: () => paramsState,
}))
vi.mock("~/features/auth/stores/session", () => ({
  useAuthSessionStore: (selector: (state: typeof authState) => unknown) =>
    selector(authState),
}))
vi.mock("~/features/business/stores/business-context", () => ({
  useBusinessContextStore: (
    selector: (state: typeof businessState) => unknown,
  ) => selector(businessState),
}))
vi.mock(
  "~/services/financial-movements/create-financial-movement-draft",
  () => ({
    createFinancialMovementDraft: vi.fn(),
  }),
)
const createMock = vi.mocked(createFinancialMovementDraft)

describe("useMovementDraftCreate", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    paramsState.movementType = "sale"
    authState.accessToken = "access-token"
    businessState.currentBusinessId = "business-id"
    createMock.mockResolvedValue({ id: "movement-id" } as never)
  })
  it("maps route types", () => {
    expect(renderHook(() => useMovementDraftCreate()).result.current.type).toBe(
      1,
    )
    paramsState.movementType = "expense"
    expect(renderHook(() => useMovementDraftCreate()).result.current.type).toBe(
      2,
    )
    paramsState.movementType = "invalid"
    expect(
      renderHook(() => useMovementDraftCreate()).result.current.type,
    ).toBeNull()
  })
  it("creates, normalizes description and navigates", async () => {
    const { result } = renderHook(() => useMovementDraftCreate())
    await act(async () =>
      result.current.submitMovement({
        movementDate: "2026-10-19",
        description: "   ",
      }),
    )
    expect(createMock).toHaveBeenCalledWith(
      "business-id",
      { type: 1, movementDate: "2026-10-19", description: null },
      "access-token",
    )
    expect(navigateMock).toHaveBeenCalledWith(
      APP_PATHS.FINANCIAL_MOVEMENT_DETAIL("movement-id"),
    )
    act(() => result.current.returnToMovements())
    expect(navigateMock).toHaveBeenLastCalledWith(APP_PATHS.FINANCIAL_MOVEMENTS)
  })
  it("reports API and fallback errors", async () => {
    createMock.mockRejectedValueOnce(
      createApiError(400, { message: "Dato inválido" }),
    )
    const first = renderHook(() => useMovementDraftCreate())
    await act(async () =>
      first.result.current.submitMovement({
        movementDate: "2026-10-19",
        description: "x",
      }),
    )
    expect(first.result.current.error).toBe("Dato inválido")
    createMock.mockRejectedValueOnce(new Error("network"))
    const second = renderHook(() => useMovementDraftCreate())
    await act(async () =>
      second.result.current.submitMovement({
        movementDate: "2026-10-19",
        description: "x",
      }),
    )
    expect(second.result.current.error).toBe(
      "No fue posible crear el borrador financiero.",
    )
  })
  it("guards missing context and invalid type", async () => {
    authState.accessToken = null
    businessState.currentBusinessId = null
    paramsState.movementType = "invalid"
    const { result } = renderHook(() => useMovementDraftCreate())
    await act(async () =>
      result.current.submitMovement({
        movementDate: "2026-10-19",
        description: "",
      }),
    )
    expect(createMock).not.toHaveBeenCalled()
  })
})

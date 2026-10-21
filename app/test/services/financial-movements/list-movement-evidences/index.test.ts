import { beforeEach, describe, expect, it, vi } from "vitest"
import { listMovementEvidences } from "~/services/financial-movements/list-movement-evidences"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))

const requestMock = vi.mocked(request)

describe("listMovementEvidences", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestMock.mockResolvedValue({})
  })

  it("uses the evidence contract", async () => {
    const signal = new AbortController().signal

    await listMovementEvidences(
      "business-id",
      "movement-id",
      "access-token",
      signal,
    )

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.MOVEMENT_EVIDENCES("business-id", "movement-id"),
      { method: "GET", accessToken: "access-token", signal },
    )
  })
})

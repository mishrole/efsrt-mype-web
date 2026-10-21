import { beforeEach, describe, expect, it, vi } from "vitest"
import { openMovementEvidence } from "~/services/financial-movements/open-movement-evidence"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))

const requestMock = vi.mocked(request)

describe("openMovementEvidence", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestMock.mockResolvedValue({})
  })

  it("uses the evidence contract", async () => {
    await openMovementEvidence(
      "business-id",
      "movement-id",
      "evidence-id",
      "access-token",
    )

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.MOVEMENT_EVIDENCE_CONTENT(
        "business-id",
        "movement-id",
        "evidence-id",
      ),
      { method: "GET", accessToken: "access-token" },
    )
  })
})

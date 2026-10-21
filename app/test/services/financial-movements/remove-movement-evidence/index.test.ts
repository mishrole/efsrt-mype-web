import { beforeEach, describe, expect, it, vi } from "vitest"
import { removeMovementEvidence } from "~/services/financial-movements/remove-movement-evidence"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))

const requestMock = vi.mocked(request)

describe("removeMovementEvidence", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestMock.mockResolvedValue({})
  })

  it("uses the evidence contract", async () => {
    const payload = { movementVersion: 7, evidenceVersion: 2 }

    await removeMovementEvidence(
      "business-id",
      "movement-id",
      "evidence-id",
      payload,
      "access-token",
    )

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.MOVEMENT_EVIDENCE_REMOVE(
        "business-id",
        "movement-id",
        "evidence-id",
      ),
      { method: "PATCH", body: payload, accessToken: "access-token" },
    )
  })
})

import { beforeEach, describe, expect, it, vi } from "vitest"
import { attachMovementEvidence } from "~/services/financial-movements/attach-movement-evidence"
import { API_ROUTES } from "~/shared/constants/api"
import { request } from "~/shared/http/client"
import { createEvidenceFormData } from "~/services/financial-movements/evidence-form-data"

vi.mock("~/shared/http/client", () => ({ request: vi.fn() }))
vi.mock("~/services/financial-movements/evidence-form-data", () => ({
  createEvidenceFormData: vi.fn(),
}))

const requestMock = vi.mocked(request)

describe("attachMovementEvidence", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestMock.mockResolvedValue({})
  })

  it("uses the evidence contract", async () => {
    const file = new File(["content"], "evidence.png", { type: "image/png" })
    const formData = new FormData()
    vi.mocked(createEvidenceFormData).mockReturnValue(formData)
    const payload = { file, movementVersion: 7 }

    await attachMovementEvidence(
      "business-id",
      "movement-id",
      payload,
      "access-token",
    )

    expect(requestMock).toHaveBeenCalledWith(
      API_ROUTES.MOVEMENT_EVIDENCES("business-id", "movement-id"),
      { method: "POST", body: formData, accessToken: "access-token" },
    )
    expect(createEvidenceFormData).toHaveBeenCalledWith(payload)
  })
})

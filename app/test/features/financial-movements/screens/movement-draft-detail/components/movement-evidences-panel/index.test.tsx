import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { MovementEvidencesPanel } from "~/features/financial-movements/screens/movement-draft-detail/components/movement-evidences-panel"

const mocks = vi.hoisted(() => ({
  accessToken: "access-token" as string | null,
  list: vi.fn(),
  attach: vi.fn(),
  replace: vi.fn(),
  open: vi.fn(),
  remove: vi.fn(),
  windowOpen: vi.fn(),
}))

vi.mock("~/features/auth/stores/session", () => ({
  useAuthSessionStore: (
    selector: (state: { accessToken: string | null }) => unknown,
  ) => selector({ accessToken: mocks.accessToken }),
}))
vi.mock("~/services/financial-movements/list-movement-evidences", () => ({
  listMovementEvidences: mocks.list,
}))
vi.mock("~/services/financial-movements/attach-movement-evidence", () => ({
  attachMovementEvidence: mocks.attach,
}))
vi.mock("~/services/financial-movements/replace-movement-evidence", () => ({
  replaceMovementEvidence: mocks.replace,
}))
vi.mock("~/services/financial-movements/open-movement-evidence", () => ({
  openMovementEvidence: mocks.open,
}))
vi.mock("~/services/financial-movements/remove-movement-evidence", () => ({
  removeMovementEvidence: mocks.remove,
}))
vi.mock(
  "~/features/financial-movements/components/movement-evidence-modal",
  () => ({
    MovementEvidenceModal: ({
      isOpen,
      evidence,
      onClose,
      onSubmit,
    }: {
      isOpen: boolean
      evidence: { id: string } | null
      onClose: () => void
      onSubmit: (file: File) => Promise<void>
    }) =>
      isOpen ? (
        <div role="dialog">
          <span>{evidence ? "replace mode" : "attach mode"}</span>
          <button
            onClick={() =>
              void onSubmit(
                new File(["evidence"], "evidence.png", { type: "image/png" }),
              )
            }
          >
            submit evidence
          </button>
          <button onClick={onClose}>close evidence modal</button>
        </div>
      ) : null,
  }),
)

const evidence = {
  id: "evidence-id",
  movementId: "movement-id",
  replacesEvidenceId: null,
  originalFileName: "invoice.pdf",
  mimeType: "application/pdf",
  sizeBytes: 2048,
  status: 1,
  removalReason: null,
  uploadedAt: "2026-10-21T06:00:00Z",
  markedForPurgeAt: null,
  purgeAfter: null,
  purgedAt: null,
  version: 2,
}
const replacement = {
  ...evidence,
  id: "replacement-id",
  replacesEvidenceId: "evidence-id",
  originalFileName: "replacement.png",
  mimeType: "image/png",
  version: 1,
}
const commonProps = {
  businessId: "business-id",
  movementId: "movement-id",
  movementVersion: 7,
  onMovementChanged: vi.fn().mockResolvedValue(undefined),
}

describe("MovementEvidencesPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.accessToken = "access-token"
    mocks.list.mockResolvedValue([evidence])
    mocks.attach.mockResolvedValue(replacement)
    mocks.replace.mockResolvedValue(replacement)
    mocks.open.mockResolvedValue({
      url: "https://storage.test/evidence",
      expiresAt: "2026-10-21T06:05:00Z",
    })
    mocks.remove.mockResolvedValue(undefined)
    Object.defineProperty(window, "open", {
      configurable: true,
      value: mocks.windowOpen,
    })
  })

  it("loads and renders active evidences", async () => {
    render(<MovementEvidencesPanel {...commonProps} />)
    expect(await screen.findByText("invoice.pdf")).toBeInTheDocument()
    expect(mocks.list).toHaveBeenCalledWith(
      "business-id",
      "movement-id",
      "access-token",
      expect.any(AbortSignal),
    )
  })

  it("shows the empty state", async () => {
    mocks.list.mockResolvedValue([])
    render(<MovementEvidencesPanel {...commonProps} />)
    expect(
      await screen.findByText("Aún no hay evidencias activas."),
    ).toBeInTheDocument()
  })

  it("attaches a new evidence and refreshes the movement", async () => {
    render(<MovementEvidencesPanel {...commonProps} />)
    await screen.findByText("invoice.pdf")
    fireEvent.click(screen.getByRole("button", { name: /Adjuntar evidencia/ }))
    expect(screen.getByText("attach mode")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "submit evidence" }))

    await waitFor(() =>
      expect(mocks.attach).toHaveBeenCalledWith(
        "business-id",
        "movement-id",
        expect.objectContaining({ movementVersion: 7 }),
        "access-token",
      ),
    )
    expect(await screen.findByText("replacement.png")).toBeInTheDocument()
    expect(commonProps.onMovementChanged).toHaveBeenCalled()
  })

  it("replaces an evidence with both versions", async () => {
    render(<MovementEvidencesPanel {...commonProps} />)
    await screen.findByText("invoice.pdf")
    fireEvent.click(screen.getByRole("button", { name: /Sustituir/ }))
    expect(screen.getByText("replace mode")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "submit evidence" }))

    await waitFor(() =>
      expect(mocks.replace).toHaveBeenCalledWith(
        "business-id",
        "movement-id",
        "evidence-id",
        expect.objectContaining({ movementVersion: 7, evidenceVersion: 2 }),
        "access-token",
      ),
    )
    expect(await screen.findByText("replacement.png")).toBeInTheDocument()
  })

  it("opens temporary content in a protected new tab", async () => {
    render(<MovementEvidencesPanel {...commonProps} />)
    await screen.findByText("invoice.pdf")
    fireEvent.click(screen.getByRole("button", { name: /Abrir/ }))

    await waitFor(() =>
      expect(mocks.open).toHaveBeenCalledWith(
        "business-id",
        "movement-id",
        "evidence-id",
        "access-token",
      ),
    )
    expect(mocks.windowOpen).toHaveBeenCalledWith(
      "https://storage.test/evidence",
      "_blank",
      "noopener,noreferrer",
    )
  })

  it("removes an evidence with both versions", async () => {
    render(<MovementEvidencesPanel {...commonProps} />)
    await screen.findByText("invoice.pdf")
    fireEvent.click(screen.getByRole("button", { name: /Retirar/ }))

    await waitFor(() =>
      expect(mocks.remove).toHaveBeenCalledWith(
        "business-id",
        "movement-id",
        "evidence-id",
        { movementVersion: 7, evidenceVersion: 2 },
        "access-token",
      ),
    )
    expect(screen.queryByText("invoice.pdf")).not.toBeInTheDocument()
    expect(commonProps.onMovementChanged).toHaveBeenCalled()
  })

  it("closes the attachment modal while idle", async () => {
    render(<MovementEvidencesPanel {...commonProps} />)
    await screen.findByText("invoice.pdf")
    fireEvent.click(screen.getByRole("button", { name: /Adjuntar evidencia/ }))
    fireEvent.click(
      screen.getByRole("button", { name: "close evidence modal" }),
    )
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("shows fallback errors for load, save, open and remove", async () => {
    mocks.list.mockRejectedValueOnce(new Error("load"))
    const { unmount } = render(<MovementEvidencesPanel {...commonProps} />)
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No fue posible cargar las evidencias.",
    )
    unmount()

    mocks.list.mockResolvedValue([evidence])
    mocks.attach.mockRejectedValueOnce(new Error("save"))
    const saveRender = render(<MovementEvidencesPanel {...commonProps} />)
    await screen.findByText("invoice.pdf")
    fireEvent.click(screen.getByRole("button", { name: /Adjuntar evidencia/ }))
    fireEvent.click(screen.getByRole("button", { name: "submit evidence" }))
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No fue posible guardar la evidencia.",
    )
    saveRender.unmount()

    mocks.open.mockRejectedValueOnce(new Error("open"))
    const openRender = render(<MovementEvidencesPanel {...commonProps} />)
    await screen.findByText("invoice.pdf")
    fireEvent.click(screen.getByRole("button", { name: /Abrir/ }))
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No fue posible abrir la evidencia.",
    )
    openRender.unmount()

    mocks.remove.mockRejectedValueOnce(new Error("remove"))
    render(<MovementEvidencesPanel {...commonProps} />)
    await screen.findByText("invoice.pdf")
    fireEvent.click(screen.getByRole("button", { name: /Retirar/ }))
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No fue posible retirar la evidencia.",
    )
  })

  it("does not request evidences without an access token", async () => {
    mocks.accessToken = null
    render(<MovementEvidencesPanel {...commonProps} />)
    expect(
      await screen.findByText("Aún no hay evidencias activas."),
    ).toBeInTheDocument()
    expect(mocks.list).not.toHaveBeenCalled()
  })
})
